import { NextRequest } from "next/server";
import { tseCache } from "@/lib/tse/cache";
import {
  SANTA_MARIA_INFO,
  TSE_BASE_URL,
  TSE_CACHE_TTL,
  TSE_POLL_INTERVAL,
  OFFICE_SLUGS,
  OFFICES_CONFIG,
} from "@/lib/tse/config";
import { createSecureJsonResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const officesStatus = OFFICE_SLUGS.map((slug) => {
    const cached = tseCache.get(`results:${slug}`);
    return {
      office: slug,
      title: OFFICES_CONFIG[slug].title,
      isCached: !!cached,
    };
  });

  const statusData = {
    system: "VOTAÍ SM - API de Resultados Oficiais",
    version: "1.0.0",
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    municipality: SANTA_MARIA_INFO,
    tse: {
      baseUrl: TSE_BASE_URL,
      pollIntervalMs: TSE_POLL_INTERVAL,
      cacheTtlMs: TSE_CACHE_TTL,
      activeCachedOffices: tseCache.size(),
    },
    offices: officesStatus,
  };

  return createSecureJsonResponse(statusData);
}
