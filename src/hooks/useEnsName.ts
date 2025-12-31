'use client';

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { getEnsName } from 'viem/ens';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { isValidAddress } from '@/lib/utils';

/**
 * Hook to resolve ENS name from an Ethereum address
 * @param address - Ethereum address to resolve
 * @returns ENS name if found, null otherwise
 */
export function useEnsName(address: string | undefined): string | null {
  const publicClient = usePublicClient();
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    // Early return for invalid addresses - reset state asynchronously
    if (!address || !isValidAddress(address)) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setEnsName(null);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    let cancelled = false;

    const resolveEns = async () => {
      try {
        // Use wagmi's public client if available, otherwise create one for mainnet
        const client = publicClient || createPublicClient({
          chain: mainnet,
          transport: http(),
        });

        const name = await getEnsName(client, {
          address: address as `0x${string}`,
        });

        if (!cancelled) {
          setEnsName(name);
        }
      } catch {
        // Silently fail - ENS resolution is optional
        if (!cancelled) {
          setEnsName(null);
        }
      }
    };

    resolveEns();

    return () => {
      cancelled = true;
    };
  }, [address, publicClient]);

  return ensName;
}

