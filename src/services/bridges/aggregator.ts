import type {
  NormalizedBridgeTransaction,
  BridgeWrappedStats,
  ChainStats,
  TokenStats,
  BusiestDayStats,
  MonthlyActivity,
} from '@/types';
import { MONTH_NAMES } from '@/lib/constants';
import { getChainName } from '@/services/chains/chainInfo';
import { calculatePercentage, formatDateISO } from '@/lib/utils';
import { acrossAdapter } from './across';
import { relayAdapter } from './relay';
import { lifiAdapter } from './lifi';

export class BridgeAggregator {
  /**
   * Fetch and aggregate bridge statistics for a wallet address
   */
  async getWrappedStats(
    address: string,
    year: number = 2025
  ): Promise<BridgeWrappedStats> {
    // Calculate timestamps for the year
    const startTimestamp = Math.floor(
      new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000
    );
    const endTimestamp = Math.floor(
      new Date(`${year}-12-31T23:59:59Z`).getTime() / 1000
    );

    // Fetch transactions from all providers in parallel
    const [acrossTransactions, relayTransactions, lifiTransactions] =
      await Promise.all([
        acrossAdapter
          .fetchTransactions(address, startTimestamp, endTimestamp)
          .catch((err) => {
            console.error('Across fetch failed:', err);
            return [];
          }),
        relayAdapter
          .fetchTransactions(address, startTimestamp, endTimestamp)
          .catch((err) => {
            console.error('Relay fetch failed:', err);
            return [];
          }),
        lifiAdapter
          .fetchTransactions(address, startTimestamp, endTimestamp)
          .catch((err) => {
            console.error('LiFi fetch failed:', err);
            return [];
          }),
      ]);

    // Combine all transactions
    const allTransactions = [
      ...acrossTransactions,
      ...relayTransactions,
      ...lifiTransactions,
    ];

    // Deduplicate transactions
    const deduplicatedTransactions = this.deduplicateTransactions(allTransactions);

    // Calculate stats
    return this.calculateStats(address, year, deduplicatedTransactions);
  }

  /**
   * Deduplicate transactions based on tx hash and chain pair
   */
  private deduplicateTransactions(
    transactions: NormalizedBridgeTransaction[]
  ): NormalizedBridgeTransaction[] {
    const seen = new Map<string, NormalizedBridgeTransaction>();

    for (const tx of transactions) {
      // Create a unique key based on source tx hash and chain pair
      const key = `${tx.txHash.toLowerCase()}-${tx.sourceChainId}-${tx.destinationChainId}`;

      // If we haven't seen this transaction, or if this one has more data
      if (!seen.has(key)) {
        seen.set(key, tx);
      } else {
        // Prefer transaction with USD value
        const existing = seen.get(key)!;
        if (tx.amountUSD > 0 && existing.amountUSD === 0) {
          seen.set(key, tx);
        }
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Calculate all wrapped statistics from transactions
   */
  private calculateStats(
    address: string,
    year: number,
    transactions: NormalizedBridgeTransaction[]
  ): BridgeWrappedStats {
    // Sort transactions by timestamp
    const sortedTransactions = [...transactions].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    // Initialize stats
    const totalBridgingActions = sortedTransactions.length;
    let totalVolumeUSD = 0;

    // Chain counts and volumes
    const sourceChainCounts = new Map<number, number>();
    const destChainCounts = new Map<number, number>();
    const destChainVolumes = new Map<number, number>();

    // Token counts and volumes
    const tokenCounts = new Map<string, { count: number; volumeUSD: number; address: string }>();

    // Daily activity
    const dailyActivity = new Map<
      string,
      { count: number; volumeUSD: number; destinations: Map<number, number> }
    >();

    // Monthly activity
    const monthlyActivity = new Map<string, { count: number; volumeUSD: number }>();

    // Provider breakdown
    const providerStats = {
      across: { count: 0, volumeUSD: 0 },
      relay: { count: 0, volumeUSD: 0 },
      lifi: { count: 0, volumeUSD: 0 },
    };

    // Process each transaction
    for (const tx of sortedTransactions) {
      totalVolumeUSD += tx.amountUSD;

      // Source chain counts
      sourceChainCounts.set(
        tx.sourceChainId,
        (sourceChainCounts.get(tx.sourceChainId) || 0) + 1
      );

      // Destination chain counts and volumes
      destChainCounts.set(
        tx.destinationChainId,
        (destChainCounts.get(tx.destinationChainId) || 0) + 1
      );
      destChainVolumes.set(
        tx.destinationChainId,
        (destChainVolumes.get(tx.destinationChainId) || 0) + tx.amountUSD
      );

      // Token counts
      const tokenKey = tx.tokenSymbol.toUpperCase();
      const tokenData = tokenCounts.get(tokenKey) || {
        count: 0,
        volumeUSD: 0,
        address: tx.tokenAddress,
      };
      tokenData.count++;
      tokenData.volumeUSD += tx.amountUSD;
      tokenCounts.set(tokenKey, tokenData);

      // Daily activity
      const dateKey = formatDateISO(tx.timestamp);
      const dayData = dailyActivity.get(dateKey) || {
        count: 0,
        volumeUSD: 0,
        destinations: new Map(),
      };
      dayData.count++;
      dayData.volumeUSD += tx.amountUSD;
      dayData.destinations.set(
        tx.destinationChainId,
        (dayData.destinations.get(tx.destinationChainId) || 0) + 1
      );
      dailyActivity.set(dateKey, dayData);

      // Monthly activity
      const monthKey = dateKey.substring(0, 7); // YYYY-MM
      const monthData = monthlyActivity.get(monthKey) || { count: 0, volumeUSD: 0 };
      monthData.count++;
      monthData.volumeUSD += tx.amountUSD;
      monthlyActivity.set(monthKey, monthData);

      // Provider breakdown
      providerStats[tx.provider].count++;
      providerStats[tx.provider].volumeUSD += tx.amountUSD;
    }

    // Calculate most used source chain
    const mostUsedSourceChain = this.getTopChainStats(
      sourceChainCounts,
      totalBridgingActions
    );

    // Calculate most used destination chain
    const mostUsedDestinationChain = this.getTopChainStats(
      destChainCounts,
      totalBridgingActions
    );

    // Calculate highest volume destination
    const highestVolumeDestination = this.getHighestVolumeChain(
      destChainVolumes,
      destChainCounts,
      totalBridgingActions
    );

    // Calculate most bridged token
    const mostBridgedToken = this.getTopTokenStats(tokenCounts, totalBridgingActions);

    // Calculate busiest day
    const busiestDay = this.getBusiestDay(dailyActivity);

    // Format monthly activity for charts
    const formattedMonthlyActivity = this.formatMonthlyActivity(
      monthlyActivity,
      year
    );

    // Get top chains
    const topSourceChains = this.getTopNChainStats(
      sourceChainCounts,
      totalBridgingActions,
      5
    );
    const topDestinationChains = this.getTopNChainStats(
      destChainCounts,
      totalBridgingActions,
      5
    );

    // Get top tokens
    const topTokens = this.getTopNTokenStats(tokenCounts, totalBridgingActions, 5);

    return {
      walletAddress: address,
      year,
      generatedAt: new Date().toISOString(),
      totalBridgingActions,
      totalVolumeUSD,
      mostUsedSourceChain,
      mostUsedDestinationChain,
      highestVolumeDestination,
      mostBridgedToken,
      busiestDay,
      providerBreakdown: providerStats,
      monthlyActivity: formattedMonthlyActivity,
      topSourceChains,
      topDestinationChains,
      topTokens,
      transactions: sortedTransactions,
    };
  }

  private getTopChainStats(
    chainCounts: Map<number, number>,
    total: number
  ): ChainStats | null {
    if (chainCounts.size === 0) return null;

    let maxChainId = 0;
    let maxCount = 0;

    for (const [chainId, count] of chainCounts) {
      if (count > maxCount) {
        maxCount = count;
        maxChainId = chainId;
      }
    }

    return {
      chainId: maxChainId,
      chainName: getChainName(maxChainId),
      count: maxCount,
      percentage: calculatePercentage(maxCount, total),
      volumeUSD: 0, // Not tracked for source chains
    };
  }

  private getHighestVolumeChain(
    chainVolumes: Map<number, number>,
    chainCounts: Map<number, number>,
    total: number
  ): ChainStats | null {
    if (chainVolumes.size === 0) return null;

    let maxChainId = 0;
    let maxVolume = 0;

    for (const [chainId, volume] of chainVolumes) {
      if (volume > maxVolume) {
        maxVolume = volume;
        maxChainId = chainId;
      }
    }

    const count = chainCounts.get(maxChainId) || 0;

    return {
      chainId: maxChainId,
      chainName: getChainName(maxChainId),
      count,
      percentage: calculatePercentage(count, total),
      volumeUSD: maxVolume,
    };
  }

  private getTopTokenStats(
    tokenCounts: Map<string, { count: number; volumeUSD: number; address: string }>,
    total: number
  ): TokenStats | null {
    if (tokenCounts.size === 0) return null;

    let maxSymbol = '';
    let maxCount = 0;
    let maxData = { count: 0, volumeUSD: 0, address: '' };

    for (const [symbol, data] of tokenCounts) {
      if (data.count > maxCount) {
        maxCount = data.count;
        maxSymbol = symbol;
        maxData = data;
      }
    }

    return {
      symbol: maxSymbol,
      address: maxData.address,
      count: maxData.count,
      totalVolumeUSD: maxData.volumeUSD,
      percentage: calculatePercentage(maxData.count, total),
    };
  }

  private getBusiestDay(
    dailyActivity: Map<
      string,
      { count: number; volumeUSD: number; destinations: Map<number, number> }
    >
  ): BusiestDayStats | null {
    if (dailyActivity.size === 0) return null;

    let maxDate = '';
    let maxCount = 0;
    let maxDayData: { count: number; volumeUSD: number; destinations: Map<number, number> } | null =
      null;

    for (const [date, data] of dailyActivity) {
      if (data.count > maxCount) {
        maxCount = data.count;
        maxDate = date;
        maxDayData = data;
      }
    }

    if (!maxDayData) return null;

    // Find primary destination for busiest day
    let primaryDestChainId = 0;
    let primaryDestCount = 0;

    for (const [chainId, count] of maxDayData.destinations) {
      if (count > primaryDestCount) {
        primaryDestCount = count;
        primaryDestChainId = chainId;
      }
    }

    return {
      date: maxDate,
      count: maxCount,
      primaryDestination: {
        chainId: primaryDestChainId,
        chainName: getChainName(primaryDestChainId),
        count: primaryDestCount,
      },
    };
  }

  private formatMonthlyActivity(
    monthlyActivity: Map<string, { count: number; volumeUSD: number }>,
    year: number
  ): MonthlyActivity[] {
    const result: MonthlyActivity[] = [];

    // Create entries for all 12 months
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const data = monthlyActivity.get(monthKey) || { count: 0, volumeUSD: 0 };

      result.push({
        month: monthKey,
        monthName: MONTH_NAMES[month - 1],
        count: data.count,
        volumeUSD: data.volumeUSD,
      });
    }

    return result;
  }

  private getTopNChainStats(
    chainCounts: Map<number, number>,
    total: number,
    n: number
  ): ChainStats[] {
    const sorted = Array.from(chainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

    return sorted.map(([chainId, count]) => ({
      chainId,
      chainName: getChainName(chainId),
      count,
      percentage: calculatePercentage(count, total),
      volumeUSD: 0,
    }));
  }

  private getTopNTokenStats(
    tokenCounts: Map<string, { count: number; volumeUSD: number; address: string }>,
    total: number,
    n: number
  ): TokenStats[] {
    const sorted = Array.from(tokenCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, n);

    return sorted.map(([symbol, data]) => ({
      symbol,
      address: data.address,
      count: data.count,
      totalVolumeUSD: data.volumeUSD,
      percentage: calculatePercentage(data.count, total),
    }));
  }
}

// Export singleton instance
export const bridgeAggregator = new BridgeAggregator();
