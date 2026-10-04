import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ErrorStateProps {
  title?: string;
  message?: string;
  lastTime?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Não foi possível atualizar os dados do TSE",
  message = "O ambiente de divulgação do Tribunal Superior Eleitoral pode estar temporariamente sobrecarregado ou inacessível.",
  lastTime,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 border border-brand-red/30 shadow-subtle text-center space-y-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 text-brand-red mx-auto flex items-center justify-center">
        <MaterialIcon name="error" size={28} />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="font-sans text-base font-bold text-brand-dark">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {message}
        </p>

        {lastTime && lastTime !== "--:--:--" && (
          <p className="text-xs text-stone-500 pt-1 font-data">
            Última atualização disponível: <strong>{lastTime}</strong>
          </p>
        )}
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-primary hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50"
        >
          <MaterialIcon
            name="refresh"
            size={16}
            className={isRetrying ? "animate-spin" : ""}
          />
          <span>{isRetrying ? "Tentando novamente..." : "Tentar novamente"}</span>
        </button>
      )}
    </div>
  );
}

