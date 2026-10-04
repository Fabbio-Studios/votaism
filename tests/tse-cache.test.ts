import { describe, it, expect, beforeEach } from "vitest";
import { tseCache } from "@/lib/tse/cache";

describe("TSE Cache Suite", () => {
  beforeEach(() => {
    tseCache.clear();
  });

  it("deve armazenar e recuperar dados dentro do TTL", () => {
    tseCache.set("test-key", { foo: "bar" }, 5000);
    const retrieved = tseCache.get<{ foo: string }>("test-key");
    expect(retrieved).toEqual({ foo: "bar" });
  });

  it("deve retornar null para chaves não existentes", () => {
    const retrieved = tseCache.get("nao-existe");
    expect(retrieved).toBeNull();
  });

  it("deve expirar chave após o TTL mas manter stale para recuperação de emergência", async () => {
    tseCache.set("fast-expire", { count: 42 }, 10); // 10ms TTL

    // Aguarda expirar
    await new Promise((r) => setTimeout(r, 20));

    // get() normal retorna null
    expect(tseCache.get("fast-expire")).toBeNull();

    // getStale() recupera o dado anterior com timestamp
    const stale = tseCache.getStale<{ count: number }>("fast-expire");
    expect(stale).not.toBeNull();
    expect(stale?.data.count).toBe(42);
  });

  it("deve permitir exclusão e limpeza do cache", () => {
    tseCache.set("key1", 1);
    tseCache.set("key2", 2);
    expect(tseCache.size()).toBe(2);

    tseCache.delete("key1");
    expect(tseCache.get("key1")).toBeNull();
    expect(tseCache.size()).toBe(1);

    tseCache.clear();
    expect(tseCache.size()).toBe(0);
  });
});
