"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface BottomNavigationProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BottomNavigation({ onRefresh, isRefreshing = false }: BottomNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Presidente",
      href: "/",
      isActive: pathname === "/" || pathname === "/resultados/presidente",
      icon: "how_to_vote" as const,
    },
    {
      label: "Governador",
      href: "/resultados/governador",
      isActive: pathname === "/resultados/governador",
      icon: "bar_chart" as const,
    },
    {
      label: "Senador",
      href: "/resultados/senador",
      isActive: pathname === "/resultados/senador",
      icon: "groups" as const,
    },
    {
      label: "Deputados",
      href: "/resultados/deputado-federal",
      isActive:
        pathname === "/resultados/deputado-federal" ||
        pathname === "/resultados/deputado-estadual",
      icon: "person" as const,
    },
    {
      label: "Sobre",
      href: "/sobre",
      isActive: pathname === "/sobre",
      icon: "info" as const,
    },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe"
      aria-label="Navegação rápida mobile"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-colors select-none ${
              item.isActive
                ? "text-brand-primary font-bold"
                : "text-stone-500 hover:text-brand-dark font-medium"
            }`}
          >
            <MaterialIcon
              name={item.icon}
              size={20}
              className={item.isActive ? "text-brand-primary" : "text-stone-400"}
            />
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

