"use client";

import React from "react";
import { NormalizedCandidate, OfficeSlug } from "@/types/tse";
import { CandidateCard } from "./CandidateCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface CandidateListProps {
  candidates: NormalizedCandidate[];
  officeTitle: string;
  officeSlug: OfficeSlug;
  isBeforeCounting?: boolean;
}

export function CandidateList({
  candidates,
  officeTitle,
  isBeforeCounting = false,
}: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-subtle text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-surface-cream/60 text-brand-primary mx-auto flex items-center justify-center">
          <MaterialIcon name="how_to_vote" size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="font-sans text-base font-bold text-brand-dark">
            {isBeforeCounting
              ? "Os resultados ainda não estão disponíveis."
              : "Nenhum resultado disponível para este cargo."}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isBeforeCounting
              ? "A divulgação oficial dos votos pelo TSE iniciará após o fechamento das urnas em Santa Maria/RN."
              : "Não foram encontrados registros oficiais de votação para este cargo no momento."}
          </p>
        </div>
      </div>
    );
  }

  const maxVotes = candidates[0]?.votes || 1;

  return (
    <section className="space-y-3" aria-label={`Classificação oficial para ${officeTitle}`}>
      <div className="flex items-center justify-between px-1">
        <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-dark/70 flex items-center gap-1.5">
          <span>Candidatos ({candidates.length})</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500 font-normal">Ordenação oficial por votos</span>
        </h2>
        <span className="text-[11px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
          Factual TSE
        </span>
      </div>

      <div className="space-y-2.5">
        {candidates.map((candidate) => (
          <CandidateCard
            key={`${candidate.number}-${candidate.name}`}
            candidate={candidate}
            maxVotes={maxVotes}
          />
        ))}
      </div>
    </section>
  );
}
