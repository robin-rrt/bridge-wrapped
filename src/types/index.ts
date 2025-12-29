// Bridge Provider Types
export type BridgeProvider = 'across' | 'relay' | 'lifi';

// Normalized Bridge Transaction - internal format for all providers
export interface NormalizedBridgeTransaction {
  id: string;
  provider: BridgeProvider;
  txHash: string;
  timestamp: number; // Unix timestamp in seconds

  // Chain info
  sourceChainId: number;
  sourceChainName: string;
  destinationChainId: number;
  destinationChainName: string;

  // Token info
  tokenSymbol: string;
  tokenAddress: string;
  amount: string; // Raw amount (wei/smallest unit)
  amountFormatted: number; // Human readable
  amountUSD: number; // USD value at time of tx

  // Status
  status: 'pending' | 'completed' | 'failed';
}

// Chain statistics
export interface ChainStats {
  chainId: number;
  chainName: string;
  count: number;
  percentage: number;
  volumeUSD: number;
  logo?: string;
}

// Token statistics
export interface TokenStats {
  symbol: string;
  address: string;
  count: number;
  totalVolumeUSD: number;
  percentage: number;
  logo?: string;
}

// Daily activity
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
  volumeUSD: number;
  destinations: Map<number, number>; // chainId -> count
}

// Busiest day stats
export interface BusiestDayStats {
  date: string;
  count: number;
  primaryDestination: {
    chainId: number;
    chainName: string;
    count: number;
  };
}

// Monthly activity for charts
export interface MonthlyActivity {
  month: string; // YYYY-MM
  monthName: string; // e.g., "January"
  count: number;
  volumeUSD: number;
}

// Provider breakdown
export interface ProviderStats {
  provider: BridgeProvider;
  count: number;
  volumeUSD: number;
  percentage: number;
}

// Main Bridge Wrapped Stats - the final output
export interface BridgeWrappedStats {
  walletAddress: string;
  year: number;
  generatedAt: string;

  // Core stats
  totalBridgingActions: number;
  totalVolumeUSD: number;

  // Chain analytics
  mostUsedSourceChain: ChainStats | null;
  mostUsedDestinationChain: ChainStats | null;
  highestVolumeDestination: ChainStats | null;

  // Token analytics
  mostBridgedToken: TokenStats | null;

  // Activity patterns
  busiestDay: BusiestDayStats | null;

  // Breakdown by provider
  providerBreakdown: {
    across: { count: number; volumeUSD: number };
    relay: { count: number; volumeUSD: number };
    lifi: { count: number; volumeUSD: number };
  };

  // Monthly activity (for charts)
  monthlyActivity: MonthlyActivity[];

  // Top chains used (top 5)
  topSourceChains: ChainStats[];
  topDestinationChains: ChainStats[];

  // Top tokens
  topTokens: TokenStats[];

  // All transactions (for detailed view)
  transactions: NormalizedBridgeTransaction[];
}

// API Response types for each provider

// Across API Response
export interface AcrossDeposit {
  id: number;
  depositId: string | number;
  depositTxHash: string;
  originChainId: number;
  destinationChainId: number;
  depositor: string;
  recipient: string;
  inputToken: string;
  inputAmount: string;
  outputToken: string;
  outputAmount: string;
  message: string;
  fillDeadline: string;
  exclusivityDeadline: string | null;
  exclusiveRelayer: string;
  quoteTimestamp: string;
  status: string;
  fillTxs?: string[];
  updatedAt?: string;
  depositTime?: number;
  depositBlockNumber?: number;
  depositBlockTimestamp?: string;
  fillBlockTimestamp?: string;
  fillTx?: string;
  depositTxnRef?: string;
  fillTxnRef?: string;
  inputPriceUsd?: string;
  outputPriceUsd?: string;
  bridgeFeeUsd?: string;
  feeBreakdown?: {
    totalBridgeFeeUsd: string;
    totalBridgeFeePct: string;
  };
  token?: {
    symbol: string;
    decimals: number;
    priceUsd?: string;
  };
}

export interface AcrossDepositsResponse {
  deposits: AcrossDeposit[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// Relay API Response
export interface RelayRequest {
  id: string;
  status: string;
  user: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;
  data: {
    inTxHashes?: string[];
    outTxHashes?: string[];
    inTxs?: Array<{
      hash: string;
      chainId: number;
      timestamp: number;
      type: string;
      block?: number;
    }>;
    outTxs?: Array<{
      hash: string;
      chainId: number;
      timestamp: number;
      type: string;
      block?: number;
    }>;
    currency: string;
    currencyObject?: {
      symbol: string;
      decimals: number;
      chainId: number;
      address: string;
    };
    feeCurrencyObject?: {
      symbol: string;
      decimals: number;
      chainId: number;
      address: string;
    };
    metadata?: {
      currencyIn?: {
        currency?: {
          symbol: string;
          decimals: number;
          address: string;
          chainId: number;
        };
        amount?: string;
        amountFormatted?: string;
        amountUsd?: string;
      };
      currencyOut?: {
        currency?: {
          symbol: string;
          decimals: number;
          address: string;
          chainId: number;
        };
        amount?: string;
        amountFormatted?: string;
        amountUsd?: string;
      };
    };
    amount: string;
    amountFormatted?: string;
    amountUsd?: string;
    feesUsd?: string;
  };
  timeEstimate?: number;
}

export interface RelayRequestsResponse {
  requests: RelayRequest[];
  continuation?: string;
}

// LiFi API Response
export interface LiFiTransfer {
  transactionId: string;
  sending: {
    txHash: string;
    txLink: string;
    amount: string;
    token: {
      address: string;
      symbol: string;
      decimals: number;
      chainId: number;
      name: string;
      coinKey?: string;
      logoURI?: string;
      priceUSD: string;
    };
    chainId: number;
    gasPrice: string;
    gasUsed: string;
    gasToken: {
      address?: string;
      chainId?: number;
      symbol: string;
      decimals: number;
      name?: string;
      coinKey?: string;
      logoURI?: string;
      priceUSD: string;
    };
    gasAmount: string;
    gasAmountUSD: string;
    amountUSD?: string;
    timestamp: number;
    value: string;
  };
  receiving: {
    txHash: string;
    txLink: string;
    amount: string;
    token: {
      address: string;
      symbol: string;
      decimals: number;
      chainId: number;
      name: string;
      coinKey?: string;
      logoURI?: string;
      priceUSD: string;
    };
    chainId: number;
    gasPrice?: string;
    gasUsed?: string;
    gasToken?: {
      address?: string;
      chainId?: number;
      symbol: string;
      decimals: number;
      name?: string;
      coinKey?: string;
      logoURI?: string;
      priceUSD: string;
    };
    gasAmount?: string;
    gasAmountUSD?: string;
    amountUSD?: string;
    timestamp: number;
    value: string;
  };
  lifiExplorerLink: string;
  fromAddress: string;
  toAddress: string;
  tool: string;
  status: string;
  substatus?: string;
  substatusMessage?: string;
}

export interface LiFiTransfersResponse {
  transfers: LiFiTransfer[];
  hasNext?: boolean;
  hasPrevious?: boolean;
  next?: string;
  previous?: string;
}

// Bridge Provider Adapter Interface
export interface BridgeProviderAdapter {
  name: BridgeProvider;
  fetchTransactions(
    address: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<NormalizedBridgeTransaction[]>;
}
