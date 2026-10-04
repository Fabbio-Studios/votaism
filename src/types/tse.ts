/**
 * VOTAÍ SM - Definições de Tipos para Integração com o TSE
 * Município: Santa Maria/RN (Código TSE: 16241, IBGE: 2409335)
 */

export type OfficeSlug =
  | "presidente"
  | "governador"
  | "senador"
  | "deputado-federal"
  | "deputado-estadual";

export type ElectionStatus =
  | "BEFORE_COUNTING" // Aguardando início da apuração
  | "COUNTING"        // Apuração em andamento (AO VIVO)
  | "FINISHED"        // Apuração encerrada
  | "UNAVAILABLE";    // Indisponível temporariamente

export interface OfficeConfig {
  slug: OfficeSlug;
  code: string;           // Ex: "1", "3", "5", "6", "7"
  paddedCargo: string;    // Ex: "c0001", "c0003", "c0005", "c0006", "c0007"
  electionCode: string;   // Ex: "6257" (Federal), "6259" (Estadual)
  paddedElection: string; // Ex: "e006257", "e006259"
  cycle: string;          // Ex: "ele2026"
  title: string;          // Ex: "Presidente", "Governador", etc.
  description: string;
}

/**
 * Estrutura bruta retornada pelos arquivos `-u.json` do TSE
 */
export interface TseRawCandidate {
  n: string;          // Número do candidato
  sqcand: string;     // Sequencial do candidato no TSE
  nm: string;         // Nome completo
  nmu: string;        // Nome na urna
  dt?: string;        // Data de nascimento
  dvt?: string;       // Destinação dos votos ("Válido", etc.)
  seq?: string;       // Ordem oficial retornada pelo TSE
  e?: string;         // Eleito ("s" ou "n")
  st?: string;        // Situação ("Eleito", "Não eleito", "2º turno", etc.)
  vap?: string;       // Votos apurados (numérico em string)
  pvap?: string;      // Percentual dos votos apurados (string formatada: "42,81")
  pvapn?: string;     // Percentual numérico
  vs?: Array<{        // Vice ou suplentes
    tp: string;
    sqcand: string;
    nm: string;
    nmu: string;
    sgp?: string;
  }>;
}

export interface TseRawParty {
  n: string;          // Número do partido
  sg: string;         // Sigla do partido
  nm: string;         // Nome do partido
  nfed?: string;      // Número da federação
  tvtn?: string;      // Total de votos na legenda/nominais
  tvan?: string;
  cand: TseRawCandidate[];
}

export interface TseRawColigacao {
  n: string;          // Sequencial da coligação
  nm: string;         // Nome da coligação
  tp: string;         // Tipo
  com: string;        // Composição (ex: "PL / PODE")
  vag?: string;
  tvtn?: string;
  tvan?: string;
  par: TseRawParty[];
}

export interface TseRawFederacao {
  n: string;
  sg: string;
  nm: string;
  com: string;
  npar: string[];
}

export interface TseRawCargo {
  cd: string;         // Código do cargo ("1", "3", "5", etc.)
  nmn: string;        // Nome neutro
  nmm: string;        // Nome masculino
  nmf: string;        // Nome feminino
  nv: string;         // Número de vagas
  fed?: TseRawFederacao[];
  agr: TseRawColigacao[];
  // Campos de totalização quando disponíveis
  s?: string;         // Seções totais
  st?: string;        // Seções totalizadas
  pst?: string;       // Percentual seções totalizadas
  e?: string;         // Eleitorado apto
  c?: string;         // Comparecimento
  pc?: string;        // Percentual comparecimento
  a?: string;         // Abstenção
  pa?: string;        // Percentual abstenção
  tv?: string;        // Total de votos
  vvc?: string;       // Votos válidos concorrentes
  pvvc?: string;      // Percentual votos válidos
  vb?: string;        // Votos brancos
  pvb?: string;       // Percentual votos brancos
  tvn?: string;       // Total votos nulos
  ptvn?: string;      // Percentual votos nulos
  vn?: string;        // Votos nulos
  pvn?: string;       // Percentual votos nulos
}

export interface TseRawUrnaResponse {
  ele: string;        // Código da eleição (ex: "6257")
  t: string;          // Turno ("1" ou "2")
  f: string;          // Fase ("o" - oficial, "s" - simulado, etc.)
  sup: string;        // Suplementar ("s" ou "n")
  tpabr: string;      // Tipo de abrangência ("mu" para município, "uf", "br")
  cdabr: string;      // Código da abrangência (ex: "16241" para Santa Maria/RN)
  dg: string;         // Data de geração (ex: "02/10/2026")
  hg: string;         // Hora de geração (ex: "20:14:06")
  idg: string;        // ID da geração
  dt: string;         // Data da totalização
  ht: string;         // Hora da totalização
  dv: string;         // Divulga ("s" ou "n")
  tf: string;         // Totalização finalizada ("s" ou "n")
  and: string;        // Apuração em andamento ("s" ou "n")
  esae?: string;      // Eleição sem candidatos / sem apuração
  mnae?: string[];    // Motivo de não apuração
  carg: TseRawCargo[];
  // Campos de totalização global do município
  s?: string;
  st?: string;
  pst?: string;
  e?: string;
  c?: string;
  pc?: string;
  a?: string;
  pa?: string;
  tv?: string;
  vvc?: string;
  pvvc?: string;
  vb?: string;
  pvb?: string;
  tvn?: string;
  ptvn?: string;
  vn?: string;
  pvn?: string;
}

/**
 * Estrutura NORMALIZADA interna para consumo no Frontend
 */
export interface NormalizedCandidate {
  position: number;
  name: string;             // Nome de urna (nmu) ou nome completo
  fullName: string;         // Nome oficial (nm)
  number: string;           // Número (ex: "13", "22")
  party: string;            // Sigla do partido (ex: "PT", "PL")
  partyNumber: string;
  partyName?: string;
  coalition?: string;       // Composição da coligação / federação
  votes: number;            // Quantidade oficial de votos
  formattedVotes: string;   // Ex: "1.234"
  percentage: number;       // Percentual numérico (ex: 42.81)
  formattedPercentage: string; // Ex: "42,81%"
  status?: string;          // Ex: "Eleito", "2º turno", "Não eleito"
  isElected: boolean;
  photoUrl?: string;        // URL da foto oficial do TSE se disponível
  vice?: {
    name: string;
    party?: string;
  };
}

export interface CountingProgress {
  totalStations: number;        // Urnas totais
  countedStations: number;      // Urnas apuradas
  percentage: number;           // Percentual de apuração (0 a 100)
  formattedPercentage: string;  // Ex: "87,50%"
  isFinished: boolean;          // Totalização encerrada (tf === "s")
  isRunning: boolean;           // Em andamento (and === "s")
}

export interface VotingDetails {
  validVotes: number;
  formattedValidVotes: string;
  validVotesPercentage: string;

  blankVotes: number;
  formattedBlankVotes: string;
  blankVotesPercentage: string;

  nullVotes: number;
  formattedNullVotes: string;
  nullVotesPercentage: string;

  turnout: number;              // Comparecimento
  formattedTurnout: string;
  turnoutPercentage: string;

  abstention: number;           // Abstenções
  formattedAbstention: string;
  abstentionPercentage: string;

  electorate: number;           // Total de eleitores aptos
  formattedElectorate: string;
}

export interface MunicipalityInfo {
  name: string;       // "Santa Maria"
  state: string;      // "RN"
  tseCode: string;    // "16241"
  ibgeCode: string;   // "2409335"
  zone: string;       // "0008"
}

export interface ElectionResultsResponse {
  source: "Tribunal Superior Eleitoral";
  sourceUrl: string;
  officialTseUrl: string;
  timestamp: string;            // ISO timestamp da requisição
  lastTseUpdate: string;        // "DD/MM/AAAA HH:MM:SS" vinda do TSE
  lastTseTime: string;          // "HH:MM:SS"
  status: ElectionStatus;
  statusLabel: string;          // "AO VIVO", "AGUARDANDO APURAÇÃO", etc.
  municipality: MunicipalityInfo;
  office: {
    slug: OfficeSlug;
    code: string;
    title: string;
  };
  election: {
    year: number;
    round: number;
    name: string;
    code: string;
  };
  counting: CountingProgress;
  votingDetails?: VotingDetails;
  candidates: NormalizedCandidate[];
  totalCandidates: number;
  isStale?: boolean;
}

