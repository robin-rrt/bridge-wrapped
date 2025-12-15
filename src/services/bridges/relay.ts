import type {
  NormalizedBridgeTransaction,
  RelayRequest,
  RelayRequestsResponse,
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

export class RelayAdapter implements BridgeProviderAdapter {
  readonly name = 'relay' as const;
  private baseUrl = API_URLS.RELAY;

  async fetchTransactions(
    address: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<NormalizedBridgeTransaction[]> {
    const allTransactions: NormalizedBridgeTransaction[] = [];
    let continuation: string | undefined;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore) {
      try {
        const response = await retryWithBackoff(() =>
          this.fetchPage(address, continuation)
        );

        if (!response.requests || response.requests.length === 0) {
          hasMore = false;
          break;
        }

        for (const request of response.requests) {
          const normalized = this.normalizeRequest(request);
          if (!normalized) continue;

          // Check if within time range
          if (isWithinYear(normalized.timestamp, startTimestamp, endTimestamp)) {
            allTransactions.push(normalized);
          }

          // If we've gone past our time range, stop
          if (normalized.timestamp < startTimestamp) {
            hasMore = false;
            break;
          }
        }

        // Check for continuation token
        if (response.continuation) {
          continuation = response.continuation;
        } else {
          hasMore = false;
        }

        pageCount++;
        // Safety limit
        if (pageCount > 100) {
          hasMore = false;
        }
      } catch (error) {
        console.error('Relay fetch error:', error);
        hasMore = false;
      }
    }

    return allTransactions;
  }

  private async fetchPage(
    address: string,
    continuation?: string
  ): Promise<RelayRequestsResponse> {
    const url = new URL(`${this.baseUrl}/requests/v2`);
    url.searchParams.set('user', address);
    url.searchParams.set('limit', PAGINATION.RELAY_LIMIT.toString());
    if (continuation) {
      url.searchParams.set('continuation', continuation);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Relay API error: ${response.status}`);
    }

    return response.json();
  }

  private normalizeRequest(
    request: RelayRequest
  ): NormalizedBridgeTransaction | null {
    try {
      // Parse timestamp from createdAt
      const timestamp = Math.floor(new Date(request.createdAt).getTime() / 1000);
      if (!timestamp || isNaN(timestamp)) return null;

      // Get token info
      const tokenSymbol =
        request.data.currencyObject?.symbol ||
        this.extractSymbolFromCurrency(request.data.currency);
      const tokenDecimals = request.data.currencyObject?.decimals || 18;
      const tokenAddress =
        request.data.currencyObject?.address ||
        request.data.currency ||
        '0x0000000000000000000000000000000000000000';

      // Calculate amounts
      const amountFormatted = request.data.amountFormatted
        ? parseFloat(request.data.amountFormatted)
        : parseTokenAmount(request.data.amount, tokenDecimals);

      const amountUSD = request.data.amountUsd
        ? parseFloat(request.data.amountUsd)
        : 0;

      // Get transaction hash
      const txHash =
        request.data.inTxHashes?.[0] ||
        request.data.outTxHashes?.[0] ||
        request.id;

      // Map status
      let status: 'pending' | 'completed' | 'failed' = 'pending';
      const requestStatus = request.status.toLowerCase();
      if (requestStatus === 'success' || requestStatus === 'completed') {
        status = 'completed';
      } else if (
        requestStatus === 'failed' ||
        requestStatus === 'refunded' ||
        requestStatus === 'cancelled'
      ) {
        status = 'failed';
      }

      return {
        id: generateTxId(
          this.name,
          txHash,
          request.originChainId,
          request.destinationChainId
        ),
        provider: this.name,
        txHash,
        timestamp,
        sourceChainId: request.originChainId,
        sourceChainName: getChainName(request.originChainId),
        destinationChainId: request.destinationChainId,
        destinationChainName: getChainName(request.destinationChainId),
        tokenSymbol,
        tokenAddress,
        amount: request.data.amount,
        amountFormatted,
        amountUSD,
        status,
      };
    } catch (error) {
      console.error('Error normalizing Relay request:', error);
      return null;
    }
  }

  private extractSymbolFromCurrency(currency: string): string {
    // Try to extract symbol from currency string (could be address or symbol)
    if (!currency) return 'Unknown';
    if (currency.startsWith('0x')) {
      // It's an address, return Unknown
      return 'Unknown';
    }
    return currency.toUpperCase();
  }
}

// Export singleton instance
export const relayAdapter = new RelayAdapter();
