import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// Import modules
import {
  parseTseUrnaData,
  parseTseInteger,
  parseTseFloat,
  formatBrNumber,
  formatBrPercentage,
} from "./src/lib/tse/parser.js";
import { normalizeTseResult } from "./src/lib/tse/normalizer.js";
import { tseCache } from "./src/lib/tse/cache.js";
import { OFFICES_CONFIG, SANTA_MARIA_INFO } from "./src/lib/tse/config.js";

const mockData = JSON.parse(
  fs.readFileSync("./tests/fixtures/tse-rn-santamaria.mock.json", "utf-8")
);

test("deve converter números inteiros e strings brasileiras corretamente", () => {
  assert.equal(parseTseInteger("1.234"), 1234);
  assert.equal(parseTseInteger("1234"), 1234);
  assert.equal(parseTseInteger(500), 500);
  assert.equal(parseTseInteger(null), 0);
  assert.equal(parseTseInteger(""), 0);
});

test("deve converter percentuais brasileiros com vírgula para float", () => {
  assert.ok(Math.abs(parseTseFloat("42,81") - 42.81) < 0.001);
  assert.ok(Math.abs(parseTseFloat("100,00") - 100.0) < 0.001);
  assert.equal(parseTseFloat("0,00"), 0);
  assert.equal(parseTseFloat(undefined), 0);
});

test("deve formatar números no padrão brasileiro", () => {
  assert.equal(formatBrNumber(1234), "1.234");
  assert.equal(formatBrNumber(0), "0");
  assert.equal(formatBrPercentage(42.81), "42,81%");
  assert.equal(formatBrPercentage(100), "100,00%");
});

test("deve identificar e confirmar o código oficial de Santa Maria/RN (16241)", () => {
  const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
  assert.equal(result.isSantaMariaConfirmed, true);
  assert.equal(result.counting.totalStations, 18);
  assert.equal(result.counting.countedStations, 15);
  assert.equal(result.status, "COUNTING");
  assert.equal(result.statusLabel, "AO VIVO");
});

test("deve extrair o detalhamento de votação com precisão", () => {
  const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
  assert.ok(result.votingDetails);
  assert.equal(result.votingDetails.validVotes, 3950);
  assert.equal(result.votingDetails.blankVotes, 70);
  assert.equal(result.votingDetails.nullVotes, 100);
  assert.equal(result.votingDetails.turnout, 4120);
  assert.equal(result.votingDetails.abstention, 770);
  assert.equal(result.votingDetails.electorate, 4890);
});

test("deve ordenar os candidatos estritamente de forma factual por votos decrescente", () => {
  const result = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
  assert.equal(result.candidates.length, 3);

  // 1º colocado: 2450 votos
  assert.equal(result.candidates[0].position, 1);
  assert.equal(result.candidates[0].name, "LULA");
  assert.equal(result.candidates[0].votes, 2450);

  // 2º colocado: 1200 votos
  assert.equal(result.candidates[1].position, 2);
  assert.equal(result.candidates[1].name, "FLAVIO BOLSONARO");
  assert.equal(result.candidates[1].votes, 1200);

  // 3º colocado: 300 votos
  assert.equal(result.candidates[2].position, 3);
  assert.equal(result.candidates[2].name, "RONALDO CAIADO");
  assert.equal(result.candidates[2].votes, 300);
});

test("deve normalizar o resultado bruto para o schema oficial do VOTAÍ SM", () => {
  const parsed = parseTseUrnaData(mockData, OFFICES_CONFIG.presidente);
  const normalized = normalizeTseResult(parsed, OFFICES_CONFIG.presidente, false);

  assert.equal(normalized.source, "Tribunal Superior Eleitoral");
  assert.equal(normalized.municipality.name, "Santa Maria");
  assert.equal(normalized.municipality.state, "RN");
  assert.equal(normalized.municipality.tseCode, SANTA_MARIA_INFO.tseCode);
  assert.equal(normalized.municipality.ibgeCode, SANTA_MARIA_INFO.ibgeCode);
  assert.equal(normalized.office.slug, "presidente");
  assert.equal(normalized.totalCandidates, 3);
  assert.equal(normalized.isStale, false);
});

test("TSE Cache deve armazenar e recuperar dados dentro do TTL", () => {
  tseCache.clear();
  tseCache.set("test-key", { foo: "bar" }, 5000);
  const retrieved = tseCache.get("test-key");
  assert.deepEqual(retrieved, { foo: "bar" });
  assert.equal(tseCache.get("nao-existe"), null);
});

console.log("All unit tests defined successfully!");

