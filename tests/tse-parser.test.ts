import { describe, it, expect } from "vitest";
import {
  parseTseUrnaData,
  parseTseInteger,
  parseTseFloat,
  formatBrNumber,
  formatBrPercentage,
} from "@/lib/tse/parser";
import { OFFICES_CONFIG } from "@/lib/tse/config";
import mockData from "./fixtures/tse-rn-santamaria.mock.json";

describe("TSE Parser & Calculation Suite", () => {
  it("deve converter números inteiros e strings brasileiras corretamente", () => {
    expect(parseTseInteger("1.234")).toBe(1234);
    expect(parseTseInteger("1234")).toBe(1234);
    expect(parseTseInteger(500)).toBe(500);
    expect(parseTseInteger(null)).toBe(0);
    expect(parseTseInteger("")).toBe(0);
  });

  it("deve converter percentuais brasileiros com vírgula para float", () => {
    expect(parseTseFloat("42,81")).toBeCloseTo(42.81);
    expect(parseTseFloat("100,00")).toBeCloseTo(100.0);
    expect(parseTseFloat("0,00")).toBeCloseTo(0.0);
    expect(parseTseFloat(undefined)).toBe(0);
  });

  it("deve formatar números no padrão brasileiro", () => {
    expect(formatBrNumber(1234)).toBe("1.234");
    expect(formatBrNumber(0)).toBe("0");
    expect(formatBrPercentage(42.81)).toBe("42,81%");
    expect(formatBrPercentage(100)).toBe("100,00%");
  });

  it("deve identificar e confirmar o código oficial de Santa Maria/RN (16241)", () => {
    const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
    expect(result.isSantaMariaConfirmed).toBe(true);
  });

  it("deve extrair dados de apuração e urnas corretamente", () => {
    const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
    expect(result.counting.totalStations).toBe(18);
    expect(result.counting.countedStations).toBe(15);
    expect(result.counting.percentage).toBeCloseTo(83.33);
    expect(result.counting.formattedPercentage).toBe("83,33%");
    expect(result.status).toBe("COUNTING");
    expect(result.statusLabel).toBe("AO VIVO");
  });

  it("deve extrair o detalhamento de votação com precisão", () => {
    const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
    expect(result.votingDetails).toBeDefined();
    expect(result.votingDetails?.validVotes).toBe(3950);
    expect(result.votingDetails?.blankVotes).toBe(70);
    expect(result.votingDetails?.nullVotes).toBe(100);
    expect(result.votingDetails?.turnout).toBe(4120);
    expect(result.votingDetails?.abstention).toBe(770);
    expect(result.votingDetails?.electorate).toBe(4890);
  });

  it("deve ordenar os candidatos estritamente de forma factual por número de votos decrescente", () => {
    const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
    expect(result.candidates.length).toBe(3);

    // 1º colocado: 2450 votos
    expect(result.candidates[0].position).toBe(1);
    expect(result.candidates[0].name).toBe("LULA");
    expect(result.candidates[0].votes).toBe(2450);
    expect(result.candidates[0].percentage).toBeCloseTo(62.03);

    // 2º colocado: 1200 votos
    expect(result.candidates[1].position).toBe(2);
    expect(result.candidates[1].name).toBe("FLAVIO BOLSONARO");
    expect(result.candidates[1].votes).toBe(1200);

    // 3º colocado: 300 votos
    expect(result.candidates[2].position).toBe(3);
    expect(result.candidates[2].name).toBe("RONALDO CAIADO");
    expect(result.candidates[2].votes).toBe(300);
  });

  it("deve lançar erro tratado em resposta inválida ou nula", () => {
    expect(() => parseTseUrnaData(null, OFFICES_CONFIG.presidente)).toThrow(
      "Resposta do TSE inválida"
    );
    expect(() => parseTseUrnaData("invalido", OFFICES_CONFIG.presidente)).toThrow(
      "Resposta do TSE inválida"
    );
  });
});
