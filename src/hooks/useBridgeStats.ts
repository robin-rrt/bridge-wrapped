'use client';

import { useQuery } from '@tanstack/react-query';
import type { BridgeWrappedStats } from '@/types';

async function fetchBridgeStats(
  address: string,
  year: number
): Promise<BridgeWrappedStats> {
  const response = await fetch(`/api/bridge-stats/${address}?year=${year}`);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to fetch bridge stats');
  }

  return response.json();
}

export function useBridgeStatsQuery(
  address: string | undefined,
  year: number = 2025
) {
  return useQuery({
    queryKey: ['bridgeStats', address, year],
    queryFn: () => fetchBridgeStats(address!, year),
    enabled: !!address && /^0x[a-fA-F0-9]{40}$/.test(address),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
