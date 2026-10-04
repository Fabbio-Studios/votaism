import { OfficeConfig, OfficeSlug } from "@/types/tse";

/**
 * Identificação do Município Alvo:
 * Santa Maria / Rio Grande do Norte / Brasil
 *
 * Descoberta Oficial TSE:
 * Arquivo: https://resultados.tse.jus.br/oficial/ele2024/619/config/mun-e000619-cm.json
 * Entrada TSE: { "cd": "16241", "cdi": "2409332", "nm": "SANTA MARIA", "z": ["0008"] }
 * Código IBGE da cidade: 2409335 (código IBGE de 7 dígitos com dígito verificador)
 * Código TSE da cidade: 16241 (5 dígitos padrão TSE)
 * Zona Eleitoral: 0008
 */
export const SANTA_MARIA_INFO = {
  name: "Santa Maria",
  state: "RN",
  tseCode: "16241",
  ibgeCode: "2409335",
  zone: "0008",
} as const;

export const TSE_BASE_URL =
  process.env.TSE_BASE_URL || "https://resultados.tse.jus.br";

export const TSE_POLL_INTERVAL = parseInt(
  process.env.TSE_POLL_INTERVAL || "15000",
  10
);

export const TSE_CACHE_TTL = parseInt(
  process.env.TSE_CACHE_TTL || "10000",
  10
);

/**
 * Códigos oficiais das Eleições Gerais 2026 obtidos do arquivo oficial:
 * https://resultados.tse.jus.br/oficial/comum/config/ele-c.json
 * Pleito: 3220 (04/10/2026)
 * Ciclo: ele2026
 * Eleição Ordinária Federal 1º Turno: 6257
 * Eleição Ordinária Estadual 1º Turno: 6259
 */
export const OFFICES_CONFIG: Record<OfficeSlug, OfficeConfig> = {
  presidente: {
    slug: "presidente",
    code: "1",
    paddedCargo: "c0001",
    electionCode: process.env.TSE_ELECTION_FEDERAL || "6257",
    paddedElection: "e006257",
    cycle: process.env.TSE_ELECTION_CYCLE || "ele2026",
    title: "Presidente",
    description: "Eleição para Presidente da República",
  },
  governador: {
    slug: "governador",
    code: "3",
    paddedCargo: "c0003",
    electionCode: process.env.TSE_ELECTION_ESTADUAL || "6259",
    paddedElection: "e006259",
    cycle: process.env.TSE_ELECTION_CYCLE || "ele2026",
    title: "Governador",
    description: "Eleição para Governador do Estado do RN",
  },
  senador: {
    slug: "senador",
    code: "5",
    paddedCargo: "c0005",
    electionCode: process.env.TSE_ELECTION_ESTADUAL || "6259",
    paddedElection: "e006259",
    cycle: process.env.TSE_ELECTION_CYCLE || "ele2026",
    title: "Senador",
    description: "Eleição para o Senado Federal por Santa Maria/RN",
  },
  "deputado-federal": {
    slug: "deputado-federal",
    code: "6",
    paddedCargo: "c0006",
    electionCode: process.env.TSE_ELECTION_ESTADUAL || "6259",
    paddedElection: "e006259",
    cycle: process.env.TSE_ELECTION_CYCLE || "ele2026",
    title: "Deputado Federal",
    description: "Eleição para a Câmara dos Deputados (votação em Santa Maria/RN)",
  },
  "deputado-estadual": {
    slug: "deputado-estadual",
    code: "7",
    paddedCargo: "c0007",
    electionCode: process.env.TSE_ELECTION_ESTADUAL || "6259",
    paddedElection: "e006259",
    cycle: process.env.TSE_ELECTION_CYCLE || "ele2026",
    title: "Deputado Estadual",
    description: "Eleição para a Assembleia Legislativa do RN (votação em Santa Maria/RN)",
  },
};

export const OFFICE_SLUGS: OfficeSlug[] = [
  "presidente",
  "governador",
  "senador",
  "deputado-federal",
  "deputado-estadual",
];

/**
 * Constrói a URL oficial do arquivo de resultado do TSE para um determinado cargo em Santa Maria/RN.
 *
 * Padrão oficial descoberto:
 * https://resultados.tse.jus.br/oficial/<ciclo>/<cd_eleicao>/dados/<uf>/<uf><cd_municipio>-<cargo>-<eleicao>-u.json
 *
 * Exemplo real testado e validado:
 * https://resultados.tse.jus.br/oficial/ele2026/6257/dados/rn/rn16241-c0001-e006257-u.json
 */
export function buildTseResultUrl(office: OfficeConfig): string {
  const base = TSE_BASE_URL.replace(/\/$/, "");
  const uf = (process.env.TSE_UF || "rn").toLowerCase();
  const cityCode = SANTA_MARIA_INFO.tseCode;
  const fileName = `${uf}${cityCode}-${office.paddedCargo}-${office.paddedElection}-u.json`;
  return `${base}/oficial/${office.cycle}/${office.electionCode}/dados/${uf}/${fileName}`;
}

/**
 * Constrói a URL oficial da foto do candidato no TSE
 */
export function buildTsePhotoUrl(
  office: OfficeConfig,
  sqcand: string,
  state: string = "rn"
): string {
  const base = TSE_BASE_URL.replace(/\/$/, "");
  // O padrão do TSE para fotos é:
  // https://resultados.tse.jus.br/oficial/<ciclo>/<cd_eleicao>/fotos/<uf>/<sqcand>.jpeg
  return `${base}/oficial/${office.cycle}/${office.electionCode}/fotos/${state.toLowerCase()}/${sqcand}.jpeg`;
}
