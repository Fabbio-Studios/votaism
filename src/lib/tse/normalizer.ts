import {
  ElectionResultsResponse,
  OfficeConfig,
} from "@/types/tse";
import { SANTA_MARIA_INFO, buildTseResultUrl } from "./config";
import { ParsedTseResult } from "./parser";

/**
 * Normaliza o resultado parseado para o formato da API interna do VOTAÍ SM
 */
export function normalizeTseResult(
  parsed: ParsedTseResult,
  officeConfig: OfficeConfig,
  isStale: boolean = false
): ElectionResultsResponse {
  const officialTseUrl = buildTseResultUrl(officeConfig);
  const nowIso = new Date().toISOString();

  const formattedLastUpdate =
    parsed.lastUpdateDate && parsed.lastUpdateTime
      ? `${parsed.lastUpdateDate} às ${parsed.lastUpdateTime}`
      : parsed.lastUpdateTime || parsed.lastUpdateDate || "Aguardando";

  return {
    source: "Tribunal Superior Eleitoral",
    sourceUrl: "https://resultados.tse.jus.br/",
    officialTseUrl,
    timestamp: nowIso,
    lastTseUpdate: formattedLastUpdate,
    lastTseTime: parsed.lastUpdateTime || "--:--:--",
    status: parsed.status,
    statusLabel: parsed.statusLabel,
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
      round: parsed.round,
      name: `Eleições 2026 - ${officeConfig.title}`,
      code: parsed.electionCode,
    },
    counting: parsed.counting,
    votingDetails: parsed.votingDetails,
    candidates: parsed.candidates,
    totalCandidates: parsed.candidates.length,
    isStale,
  };
}
