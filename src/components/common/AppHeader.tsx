"use client";

import React from "react";
import Link from "next/link";
import { ElectionStatus } from "@/types/tse";
import { LiveStatus } from "@/components/dashboard/LiveStatus";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface AppHeaderProps {
  status: ElectionStatus;
  statusLabel?: string;
  isStale?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AppHeader({
  status,
  statusLabel,
  isStale = false,
  onRefresh,
  isRefreshing = false,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface-light/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Logo / Títulos */}
        <Link
          href="/"
          className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
          aria-label="VOTAÍ SM - Ir para início"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-brand-dark tracking-tight leading-none group-hover:text-brand-primary transition-colors">
              VOTAÍ SM
            </h1>
            <span className="text-[10px] font-bold font-data bg-brand-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
              2026
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-stone-600 font-medium tracking-tight mt-0.5">
            Resultados Eleitorais • Santa Maria/RN
          </span>
        </Link>

        {/* Status e Ações */}
        <div className="flex items-center gap-2">
          <LiveStatus status={status} statusLabel={statusLabel} isStale={isStale} />

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Atualizar agora do TSE"
              className="p-2 rounded-xl text-brand-dark hover:bg-stone-200/60 active:scale-95 transition-all border border-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
              title="Atualizar dados agora"
            >
              <MaterialIcon
                name="refresh"
                size={18}
                className={isRefreshing ? "animate-spin text-brand-primary" : "text-brand-dark"}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
