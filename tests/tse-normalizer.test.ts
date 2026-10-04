import { describe, it, expect } from "vitest";
import { parseTseUrnaData } from "@/lib/tse/parser";
import { normalizeTseResult } from "@/lib/tse/normalizer";
import { OFFICES_CONFIG, SANTA_MARIA_INFO } from "@/lib/tse/config";
import mockData from "./fixtures/tse-rn-santamaria.mock.json";

describe("TSE Normalizer Suite", () => {
  it("deve normalizar o resultado bruto para o schema oficial do VOTAÍ SM", () => {
    const parsed = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
    const normalized = normalizeTseResult(parsed, OFFICES_CONFIG.presidente, false);

    expect(normalized.source).toBe("Tribunal Superior Eleitoral");
    expect(normalized.sourceUrl).toBe("https://resultados.tse.jus.br/");
    expect(normalized.municipality.name).toBe("Santa Maria");
    expect(normalized.municipality.state).toBe("RN");
    expect(normalized.municipality.tseCode).toBe(SANTA_MARIA_INFO.tseCode);
    expect(normalized.municipality.ibgeCode).toBe(SANTA_MARIA_INFO.ibgeCode);
    expect(normalized.office.slug).toBe("presidente");
    expect(normalized.office.title).toBe("Presidente");
    expect(normalized.candidates.length).toBe(3);
    expect(normalized.totalCandidates).toBe(3);
    expect(normalized.isStale).toBe(false);
  });

  it("deve indicar isStale corretamente quando requisitado em fallback", () => {
    const parsed = parseTseUrnaData(mockData, OFFICES_CONFIG.governador);
    const normalized = normalizeTseResult(parsed, OFFICES_CONFIG.governador, true);

    expect(normalized.isStale).toBe(true);
    expect(normalized.office.slug).toBe("governador");
  });
});

