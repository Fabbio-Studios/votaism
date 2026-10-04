import { notFound } from "next/navigation";
import { getOfficeResults } from "@/lib/tse/client";
import { OFFICE_SLUGS, OFFICES_CONFIG } from "@/lib/tse/config";
import { OfficeSlug } from "@/types/tse";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface OfficePageProps {
  params: Promise<{
    office: string;
  }>;
}

export async function generateMetadata({ params }: OfficePageProps): Promise<Metadata> {
  const { office } = await params;
  if (!OFFICE_SLUGS.includes(office as OfficeSlug)) {
    return { title: "Cargo não encontrado - VOTAÍ SM" };
  }
  const config = OFFICES_CONFIG[office as OfficeSlug];
  return {
    title: `${config.title} - Resultados Eleições 2026 em Santa Maria/RN | VOTAÍ SM`,
    description: `Acompanhe em tempo real a apuração para o cargo de ${config.title} em Santa Maria/RN diretamente do TSE.`,
  };
}

export function generateStaticParams() {
  return OFFICE_SLUGS.map((slug) => ({ office: slug }));
}

export default async function OfficePage({ params }: OfficePageProps) {
  const { office } = await params;

  if (!OFFICE_SLUGS.includes(office as OfficeSlug)) {
    notFound();
  }

  const officeSlug = office as OfficeSlug;

  let initialData = null;
  try {
    initialData = await getOfficeResults(officeSlug);
  } catch (err) {
    console.error(`[OfficePage ${officeSlug}] Erro ao carregar dados:`, err);
  }

  return (
    <ResultsDashboard
      initialOffice={officeSlug}
      initialData={initialData}
    />
  );
}

