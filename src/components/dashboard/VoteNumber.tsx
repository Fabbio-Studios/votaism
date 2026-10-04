"use client";

import React, { useEffect, useState, useRef } from "react";
import { formatBrNumber } from "@/lib/tse/parser";

interface VoteNumberProps {
  value: number;
  className?: string;
}

/**
 * Exibe o número de votos com microinteração suave quando o valor se altera.
 * Respeita preferências de redução de movimento (prefers-reduced-motion).
 */
export function VoteNumber({ value, className = "" }: VoteNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      // Verifica se o usuário prefere redução de movimento
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setDisplayValue(value);
        prevValueRef.current = value;
        return;
      }

      // Ativa microinteração suave de destaque
      setIsHighlighting(true);
      const timer = setTimeout(() => {
        setIsHighlighting(false);
      }, 900);

      // Animação de contagem suave (600ms)
      const start = prevValueRef.current;
      const end = value;
      const duration = 600;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing suave (easeOutCubic)
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * ease);

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
          prevValueRef.current = end;
        }
      };

      requestAnimationFrame(animate);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`transition-colors duration-300 ${
        isHighlighting ? "text-brand-primary font-bold scale-[1.02]" : ""
      } ${className}`}
    >
      {formatBrNumber(displayValue)}
    </span>
  );
}

