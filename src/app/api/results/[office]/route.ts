import { NextRequest, NextResponse } from "next/server";
import { getOfficeResults } from "@/lib/tse/client";
import { OFFICE_SLUGS } from "@/lib/tse/config";
import { OfficeSlug } from "@/types/tse";
import { checkRateLimit, createSecureJsonResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    office: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

  const { office } = await params;
  const forceFresh = request.nextUrl.searchParams.get("fresh") === "true";

  if (!OFFICE_SLUGS.includes(office as OfficeSlug)) {
    return NextResponse.json(
      {
        error: `Cargo inválido: ${office}. Cargos disponíveis: ${OFFICE_SLUGS.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  try {
    const results = await getOfficeResults(office as OfficeSlug, { forceFresh });
    return createSecureJsonResponse(results);
  } catch (error: unknown) {
    console.error(`[API /api/results/${office}] Erro interno:`, error);
    return NextResponse.json(
      {
        error: "Não foi possível carregar os resultados no momento.",
        source: "Tribunal Superior Eleitoral",
      },
      { status: 500 }
    );
  }
}

