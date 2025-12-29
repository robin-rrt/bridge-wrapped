import type {
  NormalizedBridgeTransaction,
  RelayRequest,
  RelayRequestsResponse,
} from '@/types';
import { API_URLS } from '@/lib/constants';
import { getChainName } from '@/services/chains/chainInfo';
import {
  generateTxId,
  parseTokenAmount,
  retryWithBackoff,
  isWithinYear,
} from '@/lib/utils';
import type { BridgeProviderAdapter } from './types';
import { coinMarketCapService } from '@/services/tokens/coinmarketcap';

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
          const normalized = await this.normalizeRequest(request);
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
    // url.searchParams.set('limit', PAGINATION.RELAY_LIMIT.toString());
    if (continuation) {
      url.searchParams.set('continuation', continuation);
    }

    console.log('Relay URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Relay API error: ${response.status}`);
    }

    const data = await response.json();
    // Uncomment to debug API responses:
    // console.log('Relay API Response:', JSON.stringify(data, null, 2));

    return data;
  }

  private async normalizeRequest(
    request: RelayRequest
  ): Promise<NormalizedBridgeTransaction | null> {
    try {
      // Parse timestamp from createdAt or use inTxs timestamp
      const timestampStr = request.createdAt || request.data.inTxs?.[0]?.timestamp;
      if (!timestampStr) return null;

      const timestamp = typeof timestampStr === 'number'
        ? timestampStr
        : Math.floor(new Date(timestampStr).getTime() / 1000);
      if (isNaN(timestamp)) return null;

      // Extract chain IDs from inTxs and outTxs
      const originChainId = request.data.inTxs?.[0]?.chainId;
      const destinationChainId = request.data.outTxs?.[0]?.chainId;

      if (!originChainId || !destinationChainId) {
        console.warn('Missing chain IDs in Relay request:', request.id);
        return null;
      }

      // Get token info from metadata or feeCurrencyObject
      const currencyIn = request.data.metadata?.currencyIn;
      const tokenAddress = currencyIn?.currency?.address ||
                          request.data.feeCurrencyObject?.address ||
                          '0x0000000000000000000000000000000000000000';

      // Get token info from CoinMarketCap API
      const tokenInfo = await coinMarketCapService.getTokenInfo(tokenAddress);

      // Fallback to API response if CoinMarketCap doesn't have the data
      const tokenSymbol = tokenInfo?.symbol ||
                         currencyIn?.currency?.symbol ||
                         request.data.feeCurrencyObject?.symbol ||
                         tokenAddress;

      const tokenDecimals = tokenInfo?.decimals ||
                           currencyIn?.currency?.decimals ||
                           request.data.feeCurrencyObject?.decimals ||
                           18;

      // Calculate amounts - use metadata if available
      const amountFormatted = currencyIn?.amountFormatted
        ? parseFloat(currencyIn.amountFormatted)
        : parseTokenAmount(currencyIn?.amount || '0', tokenDecimals);

      // Use provided USD amount directly (already calculated by Relay API)
      const amountUSD = currencyIn?.amountUsd
        ? parseFloat(currencyIn.amountUsd)
        : 0;

      // Debug logging for high values
      if (amountUSD > 100000) {
        console.log('[Relay] High value detected:', {
          symbol: tokenSymbol,
          amount: currencyIn?.amount,
          decimals: tokenDecimals,
          amountFormatted,
          amountUSD,
          providedUSD: currencyIn?.amountUsd,
          requestId: request.id
        });
      }

      // Get transaction hash
      const txHash = request.data.inTxs?.[0]?.hash || request.id;

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
          originChainId,
          destinationChainId
        ),
        provider: this.name,
        txHash,
        timestamp,
        sourceChainId: originChainId,
        sourceChainName: getChainName(originChainId),
        destinationChainId: destinationChainId,
        destinationChainName: getChainName(destinationChainId),
        tokenSymbol,
        tokenAddress,
        amount: currencyIn?.amount || '0',
        amountFormatted,
        amountUSD,
        status,
      };
    } catch (error) {
      console.error('Error normalizing Relay request:', error);
      return null;
    }
  }

}

// Export singleton instance
export const relayAdapter = new RelayAdapter();
