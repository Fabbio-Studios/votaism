"use client";

import React, { useState } from "react";
import { OfficeSlug, ElectionResultsResponse } from "@/types/tse";
import { OFFICES_CONFIG } from "@/lib/tse/config";
import { useElectionResults } from "@/hooks/useElectionResults";
import { AppHeader } from "@/components/common/AppHeader";
import { OfficeSelector } from "./OfficeSelector";
import { CountingProgress } from "./CountingProgress";
import { CandidateList } from "./CandidateList";
import { TurnoutCard } from "./TurnoutCard";
import { DataSourceCard } from "./DataSourceCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { BottomNavigation } from "@/components/common/BottomNavigation";
import { Footer } from "@/components/common/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ResultsDashboardProps {
  initialOffice?: OfficeSlug;
  initialData?: ElectionResultsResponse | null;
}

export function ResultsDashboard({
  initialOffice = "presidente",
  initialData = null,
}: ResultsDashboardProps) {
  const [selectedOffice, setSelectedOffice] = useState<OfficeSlug>(initialOffice);

  const {
    data,
    isLoading,
    isRefreshing,
    error,
    secondsAgo,
    refreshNow,
  } = useElectionResults({
    office: selectedOffice,
    initialData: selectedOffice === initialOffice ? initialData : null,
  });

  const officeConfig = OFFICES_CONFIG[selectedOffice];

  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-stone-900 selection:bg-brand-light/40">
      {/* Header Fixo */}
      <AppHeader
        status={data?.status || "BEFORE_COUNTING"}
        statusLabel={data?.statusLabel}
        isStale={data?.isStale}
        onRefresh={refreshNow}
        isRefreshing={isRefreshing}
      />

      {/* Conteúdo Principal Centralizado (Mobile 390px -> Desktop max-w-2xl) */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Aviso de Discreta Informação de Origem dos Dados (Seção 30) */}
        <aside
          className="bg-brand-cream/60 border border-brand-primary/20 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-brand-dark/90"
          aria-label="Aviso sobre origem dos dados eleitorais"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MaterialIcon name="info" size={15} className="text-brand-primary shrink-0" />
            <span className="truncate">
              Dados oficiais do <strong>TSE</strong> para <strong>Santa Maria/RN</strong>
            </span>
          </div>

          <div className="shrink-0 font-data text-stone-500 text-[10px] sm:text-[11px]">
            {secondsAgo === 0 ? "Atualizado agora" : `Atualizado há ${secondsAgo}s`}
          </div>
        </aside>

        {/* Seletor de Cargos */}
        <OfficeSelector
          selectedOffice={selectedOffice}
          onSelectOffice={(slug) => setSelectedOffice(slug)}
        />

        {/* Conteúdo do Cargo */}
        {isLoading && !data ? (
          <LoadingSkeleton />
        ) : error && !data ? (
          <ErrorState
            onRetry={refreshNow}
            isRetrying={isRefreshing}
          />
        ) : data ? (
          <div className="space-y-4 sm:space-y-5">
            {/* Card de Apuração Geral */}
            <CountingProgress
              counting={data.counting}
              lastUpdate={data.lastTseUpdate}
              lastTime={data.lastTseTime}
              onRefresh={refreshNow}
              isRefreshing={isRefreshing}
            />

            {/* Cabeçalho do Cargo Atual */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-brand-dark font-normal">
                  {data.office.title}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {officeConfig.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">
                  1º Turno 2026
                </span>
              </div>
            </div>

            {/* Lista Ordenada Factualmente de Candidatos */}
            <CandidateList
              candidates={data.candidates}
              officeTitle={data.office.title}
              officeSlug={selectedOffice}
              isBeforeCounting={data.status === "BEFORE_COUNTING"}
            />

            {/* Card de Detalhamento da Votação (Votos válidos, brancos, nulos, abstenções) */}
            <TurnoutCard
              votingDetails={data.votingDetails}
              counting={data.counting}
            />

            {/* Card de Transparência e Origem dos Dados (Seção 9) */}
            <DataSourceCard />
          </div>
        ) : null}
      </main>

      {/* Footer personalizado (Fábio Gutemberg / Calangos Marketing) */}
      <Footer />

      {/* Barra de Navegação Inferior para Telas Mobile (390px) */}
      <BottomNavigation onRefresh={refreshNow} isRefreshing={isRefreshing} />
    </div>
  );
}
