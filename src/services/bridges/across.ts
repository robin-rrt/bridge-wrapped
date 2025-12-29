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
import { coinMarketCapService } from '@/services/tokens/coinmarketcap';

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
          const normalized = await this.normalizeDeposit(deposit);
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
    // url.searchParams.set('limit', PAGINATION.ACROSS_LIMIT.toString());
    // url.searchParams.set('skip', offset.toString());

    console.log(url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Across API error: ${response.status}`);
    }

    const data = await response.json();
    //console.log('Across API Response:', JSON.stringify(data, null, 2));

    // The API returns a flat array, but we need it wrapped in the expected format
    if (Array.isArray(data)) {
      return {
        deposits: data,
        pagination: {
          limit: PAGINATION.ACROSS_LIMIT,
          offset: offset,
          total: data.length
        }
      };
    }

    return data;
  }

  private async normalizeDeposit(
    deposit: AcrossDeposit
  ): Promise<NormalizedBridgeTransaction | null> {
    try {
      // Get timestamp from depositBlockTimestamp or quoteTimestamp (both are ISO strings)
      const timestampStr = deposit.depositBlockTimestamp || deposit.quoteTimestamp;
      if (!timestampStr) return null;

      // Convert ISO string to Unix timestamp in seconds
      const timestamp = Math.floor(new Date(timestampStr).getTime() / 1000);
      if (isNaN(timestamp)) return null;

      // Get token info from CoinMarketCap API
      const tokenInfo = await coinMarketCapService.getTokenInfo(deposit.inputToken);

      // Fallback to API response if CoinMarketCap doesn't have the data
      const tokenSymbol = tokenInfo?.symbol || deposit.token?.symbol || deposit.inputToken;
      const tokenDecimals = tokenInfo?.decimals || deposit.token?.decimals || 18;

      // Calculate formatted amount first
      const amountFormatted = parseTokenAmount(
        deposit.inputAmount,
        tokenDecimals
      );

      // Get price from API - these are already in correct USD format
      let tokenPriceUSD = 0;
      if (deposit.inputPriceUsd) {
        tokenPriceUSD = parseFloat(deposit.inputPriceUsd);
      } else if (deposit.token?.priceUsd) {
        tokenPriceUSD = parseFloat(deposit.token.priceUsd);
      }

      // Calculate USD value
      const amountUSD = amountFormatted * tokenPriceUSD;

      // Debug logging for high values
      if (amountUSD > 100000) {
        console.log('[Across] High value detected:', {
          sourceChain: deposit.originChainId,
          destChain: deposit.destinationChainId,
          tokenAddress: deposit.inputToken,
          symbol: tokenSymbol,
          amount: deposit.inputAmount,
          decimals: tokenDecimals,
          amountFormatted,
          tokenPriceUSD,
          amountUSD,
          txHash: deposit.depositTxHash
        });
      }

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
