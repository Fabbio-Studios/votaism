"use client";

import React, { useState } from "react";
import Image from "next/image";
import { NormalizedCandidate } from "@/types/tse";
import { VoteNumber } from "./VoteNumber";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { formatBrPercentage } from "@/lib/tse/parser";

interface CandidateCardProps {
  candidate: NormalizedCandidate;
}

function CandidateCardComponent({ candidate }: CandidateCardProps) {
  const [photoError, setPhotoError] = useState(false);

  // Formata a posição com zero à esquerda (01, 02, etc.)
  const formattedPosition = candidate.position.toString().padStart(2, "0");

  // Iniciais para avatar neutro
  const initials = candidate.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isLeading = candidate.position === 1;

  return (
    <article
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 border bg-white ${
        isLeading
          ? "border-brand-primary/40 shadow-card bg-gradient-to-b from-white to-surface-light/40"
          : "border-stone-200/90 shadow-subtle hover:border-brand-primary/30"
      }`}
      aria-label={`${candidate.position}º colocado: ${candidate.name}, ${candidate.formattedVotes} votos`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Posição e Foto / Avatar Neutro Oficial */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <span
            className={`font-data text-xs font-bold px-2 py-0.5 rounded-md ${
              isLeading
                ? "bg-brand-primary text-white"
                : "bg-stone-100 text-stone-600 border border-stone-200"
            }`}
          >
            {formattedPosition}
          </span>

          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-400">
            {candidate.photoUrl && !photoError ? (
              <Image
                src={candidate.photoUrl}
                alt={`Foto oficial de ${candidate.name}`}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover object-top"
                onError={() => setPhotoError(true)}
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-surface-cream/50 text-brand-dark">
                <span className="font-data font-bold text-sm text-brand-dark">
                  {initials || <MaterialIcon name="person" size={24} />}
                </span>
                <span className="text-[10px] font-medium text-stone-500 mt-0.5">
                  #{candidate.number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Candidato */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-sans text-base sm:text-lg font-bold text-brand-dark leading-snug truncate">
                  {candidate.name}
                </h3>
                {candidate.isElected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary text-white">
                    <MaterialIcon name="verified" size={12} />
                    <span>Eleito</span>
                  </span>
                )}
                {candidate.status && !candidate.isElected && (
                  <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {candidate.status}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5 flex-wrap">
                <span className="font-semibold text-brand-primary">
                  {candidate.party}
                </span>
                <span className="text-stone-300">•</span>
                <span className="font-data text-stone-700 font-medium">
                  Nº {candidate.number}
                </span>
                {candidate.coalition && (
                  <>
                    <span className="text-stone-300 hidden sm:inline">•</span>
                    <span className="text-stone-500 text-[11px] truncate max-w-[200px] hidden sm:inline">
                      {candidate.coalition}
                    </span>
                  </>
                )}
              </div>

              {candidate.vice && (
                <p className="text-[11px] text-stone-500 mt-1 truncate">
                  Vice: {candidate.vice.name} ({candidate.vice.party})
                </p>
              )}
            </div>

            {/* Destaque de Percentual (Hierarquia Tipográfica Inter) */}
            <div className="text-right shrink-0">
              <div className="font-data text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
                <VoteNumber
                  value={candidate.percentage}
                  formatValue={formatBrPercentage}
                />
              </div>
              <div className="text-xs text-stone-500 font-data font-medium mt-0.5">
                <VoteNumber value={candidate.votes} /> votos
              </div>
            </div>
          </div>

          {/* Barra de Progresso do Candidato */}
          <div className="mt-3">
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isLeading
                    ? "bg-brand-primary"
                    : "bg-brand-light"
                }`}
                style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
                role="progressbar"
                aria-valuenow={candidate.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Percentual de votos de ${candidate.name}: ${candidate.formattedPercentage}`}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function areCandidatesVisuallyEqual(
  previous: NormalizedCandidate,
  next: NormalizedCandidate
) {
  return (
    previous.position === next.position &&
    previous.name === next.name &&
    previous.number === next.number &&
    previous.photoUrl === next.photoUrl &&
    previous.isElected === next.isElected &&
    previous.status === next.status &&
    previous.party === next.party &&
    previous.coalition === next.coalition &&
    previous.formattedVotes === next.formattedVotes &&
    previous.votes === next.votes &&
    previous.formattedPercentage === next.formattedPercentage &&
    previous.percentage === next.percentage &&
    previous.vice?.name === next.vice?.name &&
    previous.vice?.party === next.vice?.party
  );
}

export const CandidateCard = React.memo(
  CandidateCardComponent,
  (previous, next) =>
    areCandidatesVisuallyEqual(previous.candidate, next.candidate)
);
