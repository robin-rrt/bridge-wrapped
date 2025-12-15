import type {
  NormalizedBridgeTransaction,
  AcrossDeposit,
  AcrossDepositsResponse,
} from '@/types';
import { API_URLS, PAGINATION } from '@/lib/constants';
import { getChainName } from '@/services/chains/chainInfo';
import {
  generateTxId,
  parseTokenAmount,
  retryWithBackoff,
  isWithinYear,
} from '@/lib/utils';
import type { BridgeProviderAdapter } from './types';

export class AcrossAdapter implements BridgeProviderAdapter {
  readonly name = 'across' as const;
  private baseUrl = API_URLS.ACROSS;

  async fetchTransactions(
    address: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<NormalizedBridgeTransaction[]> {
    const allTransactions: NormalizedBridgeTransaction[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await retryWithBackoff(() =>
          this.fetchPage(address, offset)
        );

        if (!response.deposits || response.deposits.length === 0) {
          hasMore = false;
          break;
        }

        for (const deposit of response.deposits) {
          const normalized = this.normalizeDeposit(deposit);
          if (!normalized) continue;

          // Check if within time range
          if (isWithinYear(normalized.timestamp, startTimestamp, endTimestamp)) {
            allTransactions.push(normalized);
          }

          // If we've gone past our time range (deposits are usually sorted desc), stop
          if (normalized.timestamp < startTimestamp) {
            hasMore = false;
            break;
          }
        }

        // Check if we got fewer results than the limit (means no more pages)
        if (response.deposits.length < PAGINATION.ACROSS_LIMIT) {
          hasMore = false;
        } else {
          offset += PAGINATION.ACROSS_LIMIT;
        }

        // Safety limit to prevent infinite loops
        if (offset > 10000) {
          hasMore = false;
        }
      } catch (error) {
        console.error('Across fetch error:', error);
        hasMore = false;
      }
    }

    return allTransactions;
  }

  private async fetchPage(
    address: string,
    offset: number
  ): Promise<AcrossDepositsResponse> {
    const url = new URL(`${this.baseUrl}/deposits`);
    url.searchParams.set('depositor', address);
    url.searchParams.set('limit', PAGINATION.ACROSS_LIMIT.toString());
    url.searchParams.set('skip', offset.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Across API error: ${response.status}`);
    }

    return response.json();
  }

  private normalizeDeposit(
    deposit: AcrossDeposit
  ): NormalizedBridgeTransaction | null {
    try {
      // Get timestamp from depositTime or quoteTimestamp
      const timestamp = deposit.depositTime || deposit.quoteTimestamp;
      if (!timestamp) return null;

      // Get token info
      const tokenSymbol = deposit.token?.symbol || 'Unknown';
      const tokenDecimals = deposit.token?.decimals || 18;
      const tokenPriceUSD = deposit.token?.priceUsd
        ? parseFloat(deposit.token.priceUsd)
        : 0;

      // Calculate formatted amount
      const amountFormatted = parseTokenAmount(
        deposit.inputAmount,
        tokenDecimals
      );
      const amountUSD = amountFormatted * tokenPriceUSD;

      // Map status
      let status: 'pending' | 'completed' | 'failed' = 'pending';
      if (deposit.status === 'filled') {
        status = 'completed';
      } else if (deposit.status === 'expired' || deposit.status === 'refunded') {
        status = 'failed';
      }

      return {
        id: generateTxId(
          this.name,
          deposit.depositTxHash,
          deposit.originChainId,
          deposit.destinationChainId
        ),
        provider: this.name,
        txHash: deposit.depositTxHash,
        timestamp,
        sourceChainId: deposit.originChainId,
        sourceChainName: getChainName(deposit.originChainId),
        destinationChainId: deposit.destinationChainId,
        destinationChainName: getChainName(deposit.destinationChainId),
        tokenSymbol,
        tokenAddress: deposit.inputToken,
        amount: deposit.inputAmount,
        amountFormatted,
        amountUSD,
        status,
      };
    } catch (error) {
      console.error('Error normalizing Across deposit:', error);
      return null;
    }
  }
}

// Export singleton instance
export const acrossAdapter = new AcrossAdapter();
