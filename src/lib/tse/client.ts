import { ElectionResultsResponse, OfficeSlug } from "@/types/tse";
import {
  OFFICES_CONFIG,
  buildTseResultUrl,
  TSE_CACHE_TTL,
  SANTA_MARIA_INFO,
} from "./config";
import { tseCache } from "./cache";
import { parseTseUrnaData } from "./parser";
import { normalizeTseResult } from "./normalizer";

const FETCH_TIMEOUT_MS = 8000;

export interface GetOfficeResultsOptions {
  forceFresh?: boolean;
}

/**
 * Consulta oficial dos resultados eleitorais de Santa Maria/RN junto ao TSE.
 *
 * Fluxo de execução:
 * 1. Verifica cache local do backend (TTL configurável).
 * 2. Se cache válido e !forceFresh, retorna do cache.
 * 3. Se expirado ou forceFresh, executa fetch no TSE com timeout e headers apropriados.
 * 4. Trata status HTTP 404 (antes da apuração) sem quebrar.
 * 5. Em caso de instabilidade temporária do TSE, retorna dado em cache (stale) com aviso.
 */
export async function getOfficeResults(
  slug: OfficeSlug,
  options: GetOfficeResultsOptions = {}
): Promise<ElectionResultsResponse> {
  const officeConfig = OFFICES_CONFIG[slug];
  if (!officeConfig) {
    throw new Error(`Cargo inválido informado: ${slug}`);
  }

  const cacheKey = `results:${slug}`;

  // 1. Verifica cache
  if (!options.forceFresh) {
    const cached = tseCache.get<ElectionResultsResponse>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const targetUrl = buildTseResultUrl(officeConfig);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "VotaiSM-Eleicoes2026/1.0 (+https://resultados.tse.jus.br)",
        "Accept": "application/json, text/plain, */*",
        "Cache-Control": "no-cache",
      },
      // Next.js fetch revalidation
      next: { revalidate: Math.floor(TSE_CACHE_TTL / 1000) },
    });

    clearTimeout(timeoutId);

    // Tratamento para quando os arquivos ainda não estiverem disponíveis no TSE (404)
    if (response.status === 404) {
      const emptyResult: ElectionResultsResponse = {
        source: "Tribunal Superior Eleitoral",
        sourceUrl: "https://resultados.tse.jus.br/",
        officialTseUrl: targetUrl,
        timestamp: new Date().toISOString(),
        lastTseUpdate: "Aguardando início",
        lastTseTime: "--:--:--",
        status: "BEFORE_COUNTING",
        statusLabel: "AGUARDANDO APURAÇÃO",
        municipality: {
          name: SANTA_MARIA_INFO.name,
          state: SANTA_MARIA_INFO.state,
          tseCode: SANTA_MARIA_INFO.tseCode,
          ibgeCode: SANTA_MARIA_INFO.ibgeCode,
          zone: SANTA_MARIA_INFO.zone,
        },
        office: {
          slug: officeConfig.slug,
          code: officeConfig.code,
          title: officeConfig.title,
        },
        election: {
          year: 2026,
          round: 1,
          name: `Eleições 2026 - ${officeConfig.title}`,
          code: officeConfig.electionCode,
        },
        counting: {
          totalStations: 0,
          countedStations: 0,
          percentage: 0,
          formattedPercentage: "0,00%",
          isFinished: false,
          isRunning: false,
        },
        candidates: [],
        totalCandidates: 0,
      };

      tseCache.set(cacheKey, emptyResult, TSE_CACHE_TTL);
      return emptyResult;
    }

    if (!response.ok) {
      throw new Error(
        `TSE retornou status HTTP ${response.status}: ${response.statusText}`
      );
    }

    const rawData = await response.json();
    const parsed = parseTseUrnaData(rawData, officeConfig);
    const normalized = normalizeTseResult(parsed, officeConfig, false);

    // Salva no cache
    tseCache.set(cacheKey, normalized, TSE_CACHE_TTL);

    return normalized;
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[VOTAÍ SM] Erro ao consultar TSE (${slug}): ${error.message}`);

    // Tenta recuperar versão anterior do cache (Stale-While-Revalidate)
    const staleEntry = tseCache.getStale<ElectionResultsResponse>(cacheKey);
    if (staleEntry) {
      return {
        ...staleEntry.data,
        isStale: true,
      };
    }

    // Se não há nenhum cache prévio, retorna resposta segura com status UNAVAILABLE
    return {
      source: "Tribunal Superior Eleitoral",
      sourceUrl: "https://resultados.tse.jus.br/",
      officialTseUrl: targetUrl,
      timestamp: new Date().toISOString(),
      lastTseUpdate: "Indisponível",
      lastTseTime: "--:--:--",
      status: "UNAVAILABLE",
      statusLabel: "TSE INDISPONÍVEL",
      municipality: {
        name: SANTA_MARIA_INFO.name,
        state: SANTA_MARIA_INFO.state,
        tseCode: SANTA_MARIA_INFO.tseCode,
        ibgeCode: SANTA_MARIA_INFO.ibgeCode,
        zone: SANTA_MARIA_INFO.zone,
      },
      office: {
        slug: officeConfig.slug,
        code: officeConfig.code,
        title: officeConfig.title,
      },
      election: {
        year: 2026,
        round: 1,
        name: `Eleições 2026 - ${officeConfig.title}`,
        code: officeConfig.electionCode,
      },
      counting: {
        totalStations: 0,
        countedStations: 0,
        percentage: 0,
        formattedPercentage: "0,00%",
        isFinished: false,
        isRunning: false,
      },
      candidates: [],
      totalCandidates: 0,
      isStale: true,
    };
  }
}

