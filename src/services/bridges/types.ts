import type { NormalizedBridgeTransaction, BridgeProvider } from '@/types';

// Common interface for all bridge provider adapters
export interface BridgeProviderAdapter {
  readonly name: BridgeProvider;

  /**
   * Fetch all transactions for a given address within a time range
   * @param address - Wallet address to fetch transactions for
   * @param startTimestamp - Start of time range (Unix timestamp in seconds)
   * @param endTimestamp - End of time range (Unix timestamp in seconds)
   * @returns Array of normalized bridge transactions
   */
  fetchTransactions(
    address: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<NormalizedBridgeTransaction[]>;
}

// Token info for normalization
export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  priceUSD?: number;
}

// Common token addresses (for fallback symbol lookup)
export const COMMON_TOKENS: Record<string, TokenInfo> = {
  // ETH (native)
  '0x0000000000000000000000000000000000000000': {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  // WETH on various chains
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    symbol: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
  },
  // USDC on Ethereum
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  },
  // USDT on Ethereum
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
  },
  // DAI on Ethereum
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
};

// Get token info from common tokens or return default
export function getTokenInfo(address: string): TokenInfo | undefined {
  return COMMON_TOKENS[address.toLowerCase()];
}
