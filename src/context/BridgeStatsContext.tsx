'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BridgeWrappedStats } from '@/types';

interface BridgeStatsContextType {
  stats: BridgeWrappedStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: (address: string, year?: number) => Promise<void>;
  clearStats: () => void;
}

const BridgeStatsContext = createContext<BridgeStatsContextType | undefined>(
  undefined
);

export function BridgeStatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<BridgeWrappedStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (address: string, year = 2025) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bridge-stats/${address}?year=${year}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearStats = useCallback(() => {
    setStats(null);
    setError(null);
  }, []);

  return (
    <BridgeStatsContext.Provider
      value={{ stats, isLoading, error, fetchStats, clearStats }}
    >
      {children}
    </BridgeStatsContext.Provider>
  );
}

export function useBridgeStats() {
  const context = useContext(BridgeStatsContext);
  if (context === undefined) {
    throw new Error('useBridgeStats must be used within a BridgeStatsProvider');
  }
  return context;
}
