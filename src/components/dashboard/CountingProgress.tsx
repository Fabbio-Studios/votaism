"use client";

import React from "react";
import { CountingProgress as CountingProgressType } from "@/types/tse";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface CountingProgressProps {
  counting: CountingProgressType;
  lastUpdate: string;
  lastTime: string;
  isAutoPolling?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CountingProgress({
  counting,
  lastTime,
  isAutoPolling = true,
  onRefresh,
  isRefreshing = false,
}: CountingProgressProps) {
  const percentage = Math.min(Math.max(counting.percentage, 0), 100);

  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-primary/15 shadow-subtle relative overflow-hidden">
      {/* Background sutil estilizado */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark/70">
            Apuração em Santa Maria/RN
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-data text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
              {counting.formattedPercentage}
            </span>
            {counting.isFinished && (
              <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                100% Totalizado
              </span>
            )}
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-dark bg-surface-light hover:bg-brand-primary/10 active:scale-95 transition-all rounded-xl border border-brand-primary/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:opacity-60"
            title="Atualizar dados agora do TSE"
            aria-label="Atualizar dados do TSE agora"
          >
            <MaterialIcon
              name="refresh"
              size={16}
              className={isRefreshing ? "animate-spin text-brand-primary" : "text-brand-dark"}
            />
            <span className="hidden sm:inline">
              {isRefreshing ? "Atualizando..." : "Atualizar agora"}
            </span>
          </button>
        )}
      </div>

      {/* Barra de Progresso Oficial */}
      <div className="space-y-1.5 mb-4">
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-light rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso da apuração: ${counting.formattedPercentage}`}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-stone-600 font-data">
          <span>
            Urnas totalizadas:{" "}
            <strong className="text-brand-dark font-bold">
              {counting.countedStations} de {counting.totalStations || 18}
            </strong>
          </span>
          <span className="text-stone-500">
            {counting.totalStations > 0 && counting.countedStations < counting.totalStations
              ? `Faltam ${counting.totalStations - counting.countedStations}`
              : counting.isFinished
              ? "Encerrado"
              : "Aguardando"}
          </span>
        </div>
      </div>

      {/* Rodapé do Card com Status de Atualização */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="schedule" size={14} className="text-stone-400" />
          <span>Última atualização:</span>
          <strong className="font-data font-semibold text-stone-700">
            {lastTime || "--:--:--"}
          </strong>
        </div>

        {isAutoPolling && (
          <div className="flex items-center gap-1.5 text-brand-primary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span>Atualização automática ativada</span>
          </div>
        )}
      </div>
    </div>
  );
}

