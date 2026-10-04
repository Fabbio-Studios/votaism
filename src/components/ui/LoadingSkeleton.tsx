import React from "react";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Carregando resultados oficiais...">
      {/* Skeleton do Card de Apuração */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle space-y-3">
        <div className="h-4 w-32 bg-stone-200 rounded-md" />
        <div className="h-10 w-44 bg-stone-200 rounded-lg" />
        <div className="h-3 w-full bg-stone-100 rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 w-28 bg-stone-200 rounded" />
          <div className="h-3 w-20 bg-stone-200 rounded" />
        </div>
      </div>

      {/* Skeleton do Seletor de Cargos */}
      <div className="flex gap-2 overflow-hidden py-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-stone-200 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Skeleton dos Candidatos */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 flex items-start gap-4 shadow-subtle"
          >
            <div className="w-14 h-14 bg-stone-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-stone-200 rounded" />
                  <div className="h-3 w-24 bg-stone-200 rounded" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-6 w-16 bg-stone-200 rounded ml-auto" />
                  <div className="h-3 w-20 bg-stone-200 rounded ml-auto" />
                </div>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
