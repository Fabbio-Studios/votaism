import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function DataSourceCard() {
  return (
    <section
      className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-subtle space-y-3"
      aria-labelledby="transparency-heading"
    >
      <div className="flex items-center gap-2">
        <MaterialIcon name="shield" size={20} className="text-brand-primary" />
        <h3
          id="transparency-heading"
          className="font-sans text-sm font-bold text-brand-dark uppercase tracking-wider"
        >
          De onde vêm estes dados?
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
        Os resultados exibidos pelo <strong>VOTAÍ SM</strong> não são produzidos, calculados ou divulgados originalmente por esta aplicação. Os dados eleitorais são obtidos a partir das informações oficiais disponibilizadas pelo <strong>Tribunal Superior Eleitoral (TSE)</strong>.
      </p>

      <p className="text-xs text-stone-500 leading-relaxed">
        Esta aplicação apenas organiza e apresenta os dados para facilitar o acompanhamento da apuração em Santa Maria/RN.
      </p>

      {/* Aviso legal discreto (Seção 30) */}
      <div className="p-3 bg-surface-light rounded-xl border border-stone-200/60 text-[11px] text-stone-600 flex items-start gap-2">
        <MaterialIcon name="info" size={16} className="text-brand-dark/70 shrink-0 mt-0.5" />
        <span>
          Os dados exibidos são provenientes do Tribunal Superior Eleitoral (TSE). O <strong>VOTAÍ SM</strong> não é uma plataforma oficial do TSE.
        </span>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
        <span className="text-xs font-medium text-stone-500">
          Fonte oficial: Tribunal Superior Eleitoral
        </span>
        <a
          href="https://resultados.tse.jus.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors"
        >
          <span>resultados.tse.jus.br</span>
          <MaterialIcon name="open_in_new" size={14} />
        </a>
      </div>
    </section>
  );
}
