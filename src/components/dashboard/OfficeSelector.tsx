"use client";

import React from "react";
import Link from "next/link";
import { OfficeSlug } from "@/types/tse";
import { OFFICE_SLUGS, OFFICES_CONFIG } from "@/lib/tse/config";

interface OfficeSelectorProps {
  selectedOffice: OfficeSlug;
  onSelectOffice?: (slug: OfficeSlug) => void;
  isLinks?: boolean; // Se true, renderiza como <Link href="..."> para SEO/rotas dedicadas
}

export function OfficeSelector({
  selectedOffice,
  onSelectOffice,
  isLinks = false,
}: OfficeSelectorProps) {
  return (
    <nav
      className="w-full overflow-x-auto no-scrollbar py-1"
      aria-label="Seleção de Cargo Eleitoral"
    >
      <div
        className="flex items-center gap-2 min-w-max px-1"
        role="tablist"
        aria-orientation="horizontal"
      >
        {OFFICE_SLUGS.map((slug) => {
          const config = OFFICES_CONFIG[slug];
          const isSelected = selectedOffice === slug;

          const buttonContent = (
            <span className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight">
                {config.title}
              </span>
            </span>
          );

          const baseClasses = `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isSelected
              ? "bg-brand-primary text-white shadow-sm font-semibold scale-[1.02]"
              : "bg-white text-brand-dark/80 hover:bg-surface-light hover:text-brand-dark border border-stone-200/80 active:scale-95"
          }`;

          if (isLinks) {
            return (
              <Link
                key={slug}
                href={slug === "presidente" ? "/" : `/resultados/${slug}`}
                role="tab"
                aria-selected={isSelected}
                className={baseClasses}
              >
                {buttonContent}
              </Link>
            );
          }

          return (
            <button
              key={slug}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectOffice && onSelectOffice(slug)}
              className={baseClasses}
            >
              {buttonContent}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
