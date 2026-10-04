import React from "react";
import { ElectionStatus } from "@/types/tse";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface LiveStatusProps {
  status: ElectionStatus;
  statusLabel?: string;
  isStale?: boolean;
}

export function LiveStatus({
  status,
  statusLabel,
  isStale = false,
}: LiveStatusProps) {
  if (isStale) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300"
        role="status"
        aria-label="Dados do TSE temporariamente desatualizados"
      >
        <MaterialIcon name="schedule" size={14} className="text-amber-600" />
        <span>TSE INSTÁVEL (DADOS RECENTES)</span>
      </div>
    );
  }

  switch (status) {
    case "COUNTING":
      return (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-brand-dark border border-brand-primary/30"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
          </span>
          <span className="font-data font-bold">AO VIVO</span>
        </div>
      );

    case "FINISHED":
      return (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-brand-dark border border-brand-primary/40"
          role="status"
        >
          <MaterialIcon
            name="check_circle"
            size={14}
            className="text-brand-dark"
          />
          <span>APURAÇÃO ENCERRADA</span>
        </div>
      );

    case "UNAVAILABLE":
      return (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-50 text-brand-red border border-brand-red/30"
          role="status"
          aria-label="TSE indisponível no momento"
        >
          <MaterialIcon name="error" size={14} className="text-brand-red" />
          <span>TSE INDISPONÍVEL</span>
        </div>
      );

    case "BEFORE_COUNTING":
    default:
      return (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-stone-100 text-stone-700 border border-stone-300"
          role="status"
        >
          <span className="inline-block w-2 h-2 rounded-full border border-stone-500"></span>
          <span>{statusLabel || "AGUARDANDO APURAÇÃO"}</span>
        </div>
      );
  }
}

