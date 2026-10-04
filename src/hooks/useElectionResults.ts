"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ElectionResultsResponse, OfficeSlug } from "@/types/tse";
import { TSE_POLL_INTERVAL } from "@/lib/tse/config";

interface UseElectionResultsOptions {
  office: OfficeSlug;
  initialData?: ElectionResultsResponse | null;
  pollInterval?: number; // ms
  enabled?: boolean;
}

export function useElectionResults({
  office,
  initialData = null,
  pollInterval = TSE_POLL_INTERVAL,
  enabled = true,
}: UseElectionResultsOptions) {
  const [data, setData] = useState<ElectionResultsResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const lastFetchTimeRef = useRef<number>(Date.now());
  const officeRef = useRef<OfficeSlug>(office);
  officeRef.current = office;

  // Função para buscar dados
  const fetchResults = useCallback(
    async (forceFresh: boolean = false) => {
      try {
        if (forceFresh) {
          setIsRefreshing(true);
        }

        const url = `/api/results/${officeRef.current}${forceFresh ? "?fresh=true" : ""}`;
        const response = await fetch(url, {
          headers: {
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na API (${response.status})`);
        }

        const json: ElectionResultsResponse = await response.json();

        // Atualiza apenas os dados sem recriar referências inteiras se não mudou
        setData(json);
        setError(null);
        lastFetchTimeRef.current = Date.now();
        setSecondsAgo(0);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.warn(`[useElectionResults] Aviso: ${errorObj.message}`);
        // Se já temos dados, mantemos os dados anteriores (resiliência / sem piscar)
        if (!data) {
          setError("Não foi possível carregar os resultados do TSE.");
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [data]
  );

  // Efeito para recarregar ao trocar de cargo
  useEffect(() => {
    setIsLoading(true);
    fetchResults(false);
  }, [office]); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling em background com intervalo configurado
  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      fetchResults(false);
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [enabled, pollInterval, fetchResults]);

  // Contador de "Atualizado há X segundos"
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastFetchTimeRef.current) / 1000);
      setSecondsAgo(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const refreshNow = useCallback(() => {
    return fetchResults(true);
  }, [fetchResults]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    secondsAgo,
    refreshNow,
  };
}

