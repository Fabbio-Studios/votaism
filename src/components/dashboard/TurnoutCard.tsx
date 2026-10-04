"use client";

import React from "react";
import { VotingDetails, CountingProgress } from "@/types/tse";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface TurnoutCardProps {
  votingDetails?: VotingDetails;
  counting: CountingProgress;
}

/**
 * Área de Detalhamento da Votação em Santa Maria/RN (Seção 8 do briefing)
 * Votos válidos, brancos, nulos, comparecimento, abstenções e total de urnas.
 */
export function TurnoutCard({ votingDetails, counting }: TurnoutCardProps) {
  if (!votingDetails) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle">
        <h3 className="font-sans text-sm font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-2">
          <MaterialIcon name="bar_chart" size={18} className="text-brand-primary" />
          <span>Detalhamento da Votação</span>
        </h3>
        <p className="text-xs text-stone-500">
          Dados de comparecimento e votos brancos/nulos serão detalhados assim que os primeiros boletins de urna forem totalizados pelo TSE.
        </p>
      </div>
    );
  }

  const items = [
    {
      label: "Votos Válidos",
      value: votingDetails.formattedValidVotes,
      pct: votingDetails.validVotesPercentage,
      color: "bg-brand-primary",
      textColor: "text-brand-dark",
      desc: "Destinados a candidatos",
    },
    {
      label: "Votos em Branco",
      value: votingDetails.formattedBlankVotes,
      pct: votingDetails.blankVotesPercentage,
      color: "bg-amber-400",
      textColor: "text-stone-700",
      desc: "Votos brancos oficiais",
    },
    {
      label: "Votos Nulos",
      value: votingDetails.formattedNullVotes,
      pct: votingDetails.nullVotesPercentage,
      color: "bg-brand-red",
      textColor: "text-brand-red",
      desc: "Votos nulos / anulados",
    },
    {
      label: "Comparecimento",
      value: votingDetails.formattedTurnout,
      pct: votingDetails.turnoutPercentage,
      color: "bg-brand-dark",
      textColor: "text-brand-dark",
      desc: "Eleitores presentes",
    },
    {
      label: "Abstenções",
      value: votingDetails.formattedAbstention,
      pct: votingDetails.abstentionPercentage,
      color: "bg-stone-400",
      textColor: "text-stone-600",
      desc: "Eleitores faltantes",
    },
    {
      label: "Eleitorado Apto",
      value: votingDetails.formattedElectorate,
      pct: "100%",
      color: "bg-brand-light",
      textColor: "text-brand-dark",
      desc: "Total apto a votar",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-subtle">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-sans text-sm font-bold text-brand-dark uppercase tracking-wider flex items-center gap-2">
          <MaterialIcon name="bar_chart" size={18} className="text-brand-primary" />
          <span>Detalhamento da Votação</span>
        </h3>
        <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          Santa Maria/RN
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface-light border border-stone-200/60 flex flex-col justify-between"
          >
            <div className="text-xs font-semibold text-stone-600 mb-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="truncate">{item.label}</span>
            </div>

            <div className="mt-1">
              <div className={`font-data text-lg font-bold ${item.textColor} tracking-tight`}>
                {item.value}
              </div>
              <div className="flex items-center justify-between text-[11px] font-data text-stone-500 mt-0.5">
                <span>{item.pct}</span>
                <span className="text-[10px] text-stone-400">{item.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

