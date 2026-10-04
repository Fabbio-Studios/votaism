import { NextRequest, NextResponse } from "next/server";
import { getOfficeResults } from "@/lib/tse/client";
import { OFFICE_SLUGS } from "@/lib/tse/config";
import { OfficeSlug } from "@/types/tse";
import { checkRateLimit, createSecureJsonResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Rate limiting por IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Aguarde alguns instantes." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const officeParam = searchParams.get("office") || "presidente";
  const forceFresh = searchParams.get("fresh") === "true";

  if (!OFFICE_SLUGS.includes(officeParam as OfficeSlug)) {
    return NextResponse.json(
      {
        error: `Cargo inválido. Cargos disponíveis: ${OFFICE_SLUGS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    const results = await getOfficeResults(officeParam as OfficeSlug, {
      forceFresh,
    });
    return createSecureJsonResponse(results);
  } catch (error: unknown) {
    console.error("[API /api/results] Erro interno:", error);
    return NextResponse.json(
      {
        error: "Não foi possível carregar os resultados no momento.",
        source: "Tribunal Superior Eleitoral",
      },
      { status: 500 }
    );
  }
}
