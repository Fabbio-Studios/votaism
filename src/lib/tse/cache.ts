import { ElectionResultsResponse } from "@/types/tse";
import { TSE_CACHE_TTL } from "./config";

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Obtém um valor do cache se ainda for válido.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      // Expirou, mas mantemos temporariamente caso seja necessário stale-while-revalidate
      return null;
    }

    return entry.data;
  }

  /**
   * Obtém o último dado salvo mesmo que expirado (útil quando o TSE estiver indisponível).
   */
  getStale<T>(key: string): { data: T; cachedAt: number } | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    return {
      data: entry.data,
      cachedAt: entry.cachedAt,
    };
  }

  /**
   * Salva um valor no cache com TTL configurável.
   */
  set<T>(key: string, data: T, ttlMs: number = TSE_CACHE_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      cachedAt: now,
      expiresAt: now + ttlMs,
    });
  }

  /**
   * Invalida uma chave específica ou todo o cache.
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Instância singleton global no processo Node.js
declare global {
  // eslint-disable-next-line no-var
  var __tseMemoryCache: MemoryCache | undefined;
}

export const tseCache =
  globalThis.__tseMemoryCache ?? (globalThis.__tseMemoryCache = new MemoryCache());
