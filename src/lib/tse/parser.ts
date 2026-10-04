import {
  TseRawUrnaResponse,
  TseRawCargo,
  TseRawCandidate,
  NormalizedCandidate,
  CountingProgress,
  VotingDetails,
  ElectionStatus,
  OfficeConfig,
} from "@/types/tse";
import { buildTsePhotoUrl, SANTA_MARIA_INFO } from "./config";

export interface ParsedTseResult {
  electionCode: string;
  cycle: string;
  round: number;
  lastUpdateDate: string; // Ex: "02/10/2026"
  lastUpdateTime: string; // Ex: "20:14:06"
  status: ElectionStatus;
  statusLabel: string;
  counting: CountingProgress;
  votingDetails?: VotingDetails;
  candidates: NormalizedCandidate[];
  isSantaMariaConfirmed: boolean;
}

/**
 * Converte strings numéricas brasileiras ("1.234" ou "1234") para número
 */
export function parseTseInteger(value?: string | number | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const cleaned = value.toString().replace(/\./g, "").trim();
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Converte strings de percentual brasileiras ("42,81" ou "42.81") para float
 */
export function parseTseFloat(value?: string | number | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const cleaned = value.toString().replace(/\./g, "").replace(",", ".").trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata um número inteiro no padrão brasileiro: 1.234
 */
export function formatBrNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Formata um percentual no padrão brasileiro: 42,81%
 */
export function formatBrPercentage(value: number): string {
  return (
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + "%"
  );
}

/**
 * Analisa e extrai os dados oficiais brutos do TSE para um determinado cargo
 */
export function parseTseUrnaData(
  rawData: unknown,
  officeConfig: OfficeConfig
): ParsedTseResult {
  if (!rawData || typeof rawData !== "object") {
    throw new Error("Resposta do TSE inválida: dados não são um objeto JSON válido.");
  }

  const json = rawData as TseRawUrnaResponse;

  // 1. Confirmação do município de Santa Maria/RN
  const isSantaMariaConfirmed =
    json.cdabr === SANTA_MARIA_INFO.tseCode ||
    json.cdabr === "16241";

  // 2. Extrai o cargo correspondente
  let cargoData: TseRawCargo | undefined;
  if (Array.isArray(json.carg)) {
    cargoData = json.carg.find((c) => c.cd === officeConfig.code) || json.carg[0];
  }

  // 3. Determina o status da apuração
  const isFinished = json.tf === "s";
  const isRunning = json.and === "s";

  // Seções (urnas)
  const totalStations = parseTseInteger(cargoData?.s ?? json.s);
  const countedStations = parseTseInteger(cargoData?.st ?? json.st);
  const stationsPercentage = parseTseFloat(cargoData?.pst ?? json.pst);

  let status: ElectionStatus;
  let statusLabel: string;

  if (isFinished) {
    status = "FINISHED";
    statusLabel = "APURAÇÃO ENCERRADA";
  } else if (isRunning || countedStations > 0) {
    status = "COUNTING";
    statusLabel = "AO VIVO";
  } else {
    status = "BEFORE_COUNTING";
    statusLabel = "AGUARDANDO APURAÇÃO";
  }

  const counting: CountingProgress = {
    totalStations,
    countedStations,
    percentage: stationsPercentage,
    formattedPercentage: formatBrPercentage(stationsPercentage),
    isFinished,
    isRunning: status === "COUNTING",
  };

  // 4. Detalhamento de votação (quando disponível)
  let votingDetails: VotingDetails | undefined;
  const validVotes = parseTseInteger(cargoData?.vvc ?? json.vvc);
  const blankVotes = parseTseInteger(cargoData?.vb ?? json.vb);
  const nullVotes = parseTseInteger(
    cargoData?.tvn ?? cargoData?.vn ?? json.tvn ?? json.vn
  );
  const turnout = parseTseInteger(cargoData?.c ?? json.c);
  const abstention = parseTseInteger(cargoData?.a ?? json.a);
  const electorate = parseTseInteger(cargoData?.e ?? json.e);

  if (electorate > 0 || turnout > 0 || validVotes > 0) {
    const validPct = parseTseFloat(cargoData?.pvvc ?? json.pvvc);
    const blankPct = parseTseFloat(cargoData?.pvb ?? json.pvb);
    const nullPct = parseTseFloat(
      cargoData?.ptvn ?? cargoData?.pvn ?? json.ptvn ?? json.pvn
    );
    const turnoutPct = parseTseFloat(cargoData?.pc ?? json.pc);
    const abstentionPct = parseTseFloat(cargoData?.pa ?? json.pa);

    votingDetails = {
      validVotes,
      formattedValidVotes: formatBrNumber(validVotes),
      validVotesPercentage: formatBrPercentage(validPct),

      blankVotes,
      formattedBlankVotes: formatBrNumber(blankVotes),
      blankVotesPercentage: formatBrPercentage(blankPct),

      nullVotes,
      formattedNullVotes: formatBrNumber(nullVotes),
      nullVotesPercentage: formatBrPercentage(nullPct),

      turnout,
      formattedTurnout: formatBrNumber(turnout),
      turnoutPercentage: formatBrPercentage(turnoutPct),

      abstention,
      formattedAbstention: formatBrNumber(abstention),
      abstentionPercentage: formatBrPercentage(abstentionPct),

      electorate,
      formattedElectorate: formatBrNumber(electorate),
    };
  }

  // 5. Extração e ordenação factual dos candidatos
  const candidates: NormalizedCandidate[] = [];

  if (cargoData && Array.isArray(cargoData.agr)) {
    for (const agrem of cargoData.agr) {
      if (Array.isArray(agrem.par)) {
        for (const party of agrem.par) {
          if (Array.isArray(party.cand)) {
            for (const cand of party.cand) {
              const votes = parseTseInteger(cand.vap);
              const percentage = parseTseFloat(cand.pvap);
              const isElected =
                cand.e === "s" ||
                (typeof cand.st === "string" &&
                  cand.st.toLowerCase().includes("eleito"));

              let viceInfo: { name: string; party?: string } | undefined;
              if (Array.isArray(cand.vs) && cand.vs.length > 0) {
                const vice = cand.vs[0];
                viceInfo = {
                  name: vice.nmu || vice.nm,
                  party: vice.sgp || party.sg,
                };
              }

              // Fotos de candidatos à Presidência ficam na pasta nacional do TSE.
              const photoState =
                officeConfig.slug === "presidente"
                  ? "br"
                  : SANTA_MARIA_INFO.state.toLowerCase();
              const photoUrl = cand.sqcand
                ? buildTsePhotoUrl(officeConfig, cand.sqcand, photoState)
                : undefined;

              candidates.push({
                position: 0, // Será calculado após a ordenação estrita
                name: (cand.nmu || cand.nm || "").trim(),
                fullName: (cand.nm || cand.nmu || "").trim(),
                number: cand.n,
                party: party.sg,
                partyNumber: party.n,
                partyName: party.nm,
                coalition: agrem.nm || agrem.com,
                votes,
                formattedVotes: formatBrNumber(votes),
                percentage,
                formattedPercentage: formatBrPercentage(percentage),
                status: cand.st || undefined,
                isElected,
                photoUrl,
                vice: viceInfo,
              });
            }
          }
        }
      }
    }
  }

  // Ordenação estritamente factual por número de votos decrescente
  // Em caso de empate, mantém o sequencial/ordem oficial do TSE
  candidates.sort((a, b) => {
    if (b.votes !== a.votes) {
      return b.votes - a.votes;
    }
    return a.name.localeCompare(b.name, "pt-BR");
  });

  // Atribui as posições factuais (1º, 2º, 3º...)
  candidates.forEach((candidate, index) => {
    candidate.position = index + 1;
  });

  return {
    electionCode: json.ele || officeConfig.electionCode,
    cycle: officeConfig.cycle,
    round: parseTseInteger(json.t) || 1,
    lastUpdateDate: json.dg || json.dt || "",
    lastUpdateTime: json.hg || json.ht || "",
    status,
    statusLabel,
    counting,
    votingDetails,
    candidates,
    isSantaMariaConfirmed,
  };
}
