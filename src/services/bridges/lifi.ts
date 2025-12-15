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
          const normalized = this.normalizeTransfer(transfer);
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
    url.searchParams.set('fromTimestamp', (startTimestamp * 1000).toString());
    url.searchParams.set('toTimestamp', (endTimestamp * 1000).toString());

    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LiFi API error: ${response.status}`);
    }

    return response.json();
  }

  private normalizeTransfer(
    transfer: LiFiTransfer
  ): NormalizedBridgeTransaction | null {
    try {
      // Get timestamp from sending info
      const timestamp = Math.floor(transfer.sending.timestamp / 1000);
      if (!timestamp || isNaN(timestamp)) return null;

      // Get token info from sending
      const tokenSymbol = transfer.sending.token.symbol || 'Unknown';
      const tokenDecimals = transfer.sending.token.decimals || 18;
      const tokenAddress = transfer.sending.token.address;
      const tokenPriceUSD = transfer.sending.token.priceUSD
        ? parseFloat(transfer.sending.token.priceUSD)
        : 0;

      // Calculate amounts
      const amountFormatted = parseTokenAmount(
        transfer.sending.amount,
        tokenDecimals
      );
      const amountUSD = transfer.sending.value
        ? parseFloat(transfer.sending.value)
        : amountFormatted * tokenPriceUSD;

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
