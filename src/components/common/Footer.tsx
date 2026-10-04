import React from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/calangosmarketing";

export function Footer() {
  return (
    <footer className="w-full bg-brand-dark text-white pt-10 pb-24 sm:pb-12 mt-12 border-t border-brand-primary/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Card CTA da Calangos Marketing */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-light mb-1">
            Seu projeto também pode ganhar vida
          </p>
          <h4 className="font-display text-xl sm:text-2xl text-surface-cream mb-2 font-normal">
            Quer criar algo assim para sua marca?
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-4">
            Desenvolvimento de produtos digitais de alta performance, visualização de dados em tempo real e marketing estratégico.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-brand-dark bg-brand-light hover:bg-brand-primary hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
            >
              <span>Conheça a Calangos Marketing</span>
              <MaterialIcon name="open_in_new" size={16} />
            </a>

            {INSTAGRAM_URL && (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Calangos Marketing"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-surface-cream hover:text-white hover:bg-white/10 transition-all border border-white/15"
              >
                <MaterialIcon name="instagram" size={18} className="text-pink-400" />
                <span>Instagram Oficial</span>
              </a>
            )}
          </div>
        </div>

        {/* Informações Institucionais e Créditos */}
        <div className="text-center space-y-3">
          <div className="text-xs text-stone-300">
            <span>Desenvolvido por </span>
            <strong className="text-white font-semibold">Fábio Gutemberg</strong>
            <span className="block text-[11px] text-brand-light font-medium mt-0.5">
              CEO da Calangos Marketing
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-stone-400 pt-2 border-t border-white/10">
            <Link
              href="/sobre"
              className="hover:text-surface-cream transition-colors underline underline-offset-4"
            >
              Sobre o VOTAÍ SM
            </Link>
            <span>•</span>
            <a
              href="https://resultados.tse.jus.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-surface-cream transition-colors"
            >
              Dados eleitorais: Tribunal Superior Eleitoral
            </a>
          </div>

          <p className="text-[11px] text-stone-400 font-data">
            © 2026 VOTAÍ SM • Resultados Oficiais de Santa Maria/RN
          </p>
        </div>
      </div>
    </footer>
  );
}
