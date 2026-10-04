import { getOfficeResults } from "@/lib/tse/client";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Pré-renderização no servidor com dados iniciais frescos do TSE
  let initialData = null;
  try {
    initialData = await getOfficeResults("presidente");
  } catch (err) {
    console.error("[HomePage] Erro ao carregar dados iniciais:", err);
  }

  return (
    <ResultsDashboard
      initialOffice="presidente"
      initialData={initialData}
    />
  );
}
