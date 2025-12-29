import type {
  NormalizedBridgeTransaction,
  LiFiTransfer,
  LiFiTransfersResponse,
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

export class LiFiAdapter implements BridgeProviderAdapter {
  readonly name = 'lifi' as const;
  private baseUrl = API_URLS.LIFI;

  async fetchTransactions(
    address: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<NormalizedBridgeTransaction[]> {
    const allTransactions: NormalizedBridgeTransaction[] = [];
    let nextCursor: string | undefined;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore) {
      try {
        const response = await retryWithBackoff(() =>
          this.fetchPage(address, startTimestamp, endTimestamp, nextCursor)
        );

        if (!response.transfers || response.transfers.length === 0) {
          hasMore = false;
          break;
        }

        for (const transfer of response.transfers) {
          const normalized = await this.normalizeTransfer(transfer);
          if (!normalized) continue;

          // Double-check time range (API should filter, but verify)
          if (isWithinYear(normalized.timestamp, startTimestamp, endTimestamp)) {
            allTransactions.push(normalized);
          }
        }

        // Check for next page
        if (response.hasNext && response.next) {
          nextCursor = response.next;
        } else {
          hasMore = false;
        }

        pageCount++;
        // Safety limit
        if (pageCount > 100) {
          hasMore = false;
        }
      } catch (error) {
        console.error('LiFi fetch error:', error);
        hasMore = false;
      }
    }

    return allTransactions;
  }

  private async fetchPage(
    address: string,
    startTimestamp: number,
    endTimestamp: number,
    cursor?: string
  ): Promise<LiFiTransfersResponse> {
    const url = new URL(`${this.baseUrl}/analytics/transfers`);
    url.searchParams.set('wallet', address);

    // LiFi uses milliseconds for timestamps
    url.searchParams.set('fromTimestamp', (startTimestamp).toString());

    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    console.log('LiFi URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LiFi API error: ${response.status}`);
    }

    const data = await response.json();
    //console.log('LiFi API Response:', JSON.stringify(data, null, 2));

    return data;
  }

  private async normalizeTransfer(
    transfer: LiFiTransfer
  ): Promise<NormalizedBridgeTransaction | null> {
    try {
      // Get timestamp from sending info - already in seconds
      const timestamp = transfer.sending.timestamp;
      if (!timestamp || isNaN(timestamp)) return null;

      // Get token info from sending
      const tokenAddress = transfer.sending.token.address;

      // Get token info from CoinMarketCap API
      const tokenInfo = await coinMarketCapService.getTokenInfo(tokenAddress);

      // Fallback to API response if CoinMarketCap doesn't have the data
      const tokenSymbol = tokenInfo?.symbol ||
                         transfer.sending.token.symbol ||
                         tokenAddress;

      const tokenDecimals = tokenInfo?.decimals ||
                           transfer.sending.token.decimals ||
                           18;

      // Calculate formatted amount
      const amountFormatted = parseTokenAmount(
        transfer.sending.amount,
        tokenDecimals
      );

      // Use amountUSD if available (already calculated by LiFi API)
      // Otherwise calculate from price
      let amountUSD = 0;
      if (transfer.sending.amountUSD) {
        amountUSD = parseFloat(transfer.sending.amountUSD);
      } else if (transfer.sending.token.priceUSD) {
        const tokenPriceUSD = parseFloat(transfer.sending.token.priceUSD);
        amountUSD = amountFormatted * tokenPriceUSD;
      }

      // Debug logging for high values
      if (amountUSD > 100000) {
        console.log('[LiFi] High value detected:', {
          symbol: tokenSymbol,
          amount: transfer.sending.amount,
          decimals: tokenDecimals,
          amountFormatted,
          tokenPriceUSD: transfer.sending.token.priceUSD,
          providedUSD: transfer.sending.amountUSD,
          amountUSD,
          txHash: transfer.sending.txHash
        });
      }

      // Map status
      let status: 'pending' | 'completed' | 'failed' = 'pending';
      const transferStatus = transfer.status?.toLowerCase();
      if (transferStatus === 'done' || transferStatus === 'completed') {
        status = 'completed';
      } else if (
        transferStatus === 'failed' ||
        transferStatus === 'refunded' ||
        transferStatus === 'cancelled'
      ) {
        status = 'failed';
      }

      return {
        id: generateTxId(
          this.name,
          transfer.sending.txHash,
          transfer.sending.chainId,
          transfer.receiving.chainId
        ),
        provider: this.name,
        txHash: transfer.sending.txHash,
        timestamp,
        sourceChainId: transfer.sending.chainId,
        sourceChainName: getChainName(transfer.sending.chainId),
        destinationChainId: transfer.receiving.chainId,
        destinationChainName: getChainName(transfer.receiving.chainId),
        tokenSymbol,
        tokenAddress,
        amount: transfer.sending.amount,
        amountFormatted,
        amountUSD,
        status,
      };
    } catch (error) {
      console.error('Error normalizing LiFi transfer:', error);
      return null;
    }
  }

}

// Export singleton instance
export const lifiAdapter = new LiFiAdapter();
