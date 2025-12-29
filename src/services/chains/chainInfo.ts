// Chain information mapping
export interface ChainInfo {
  id: number;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
  color: string;
  logoUrl?: string;
}

// Comprehensive chain mapping
export const CHAINS: Record<number, ChainInfo> = {
  // Ethereum Mainnet
  1: {
    id: 1,
    name: 'Ethereum',
    shortName: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://etherscan.io',
    color: '#627EEA',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  // Optimism
  10: {
    id: 10,
    name: 'Optimism',
    shortName: 'OP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://optimistic.etherscan.io',
    color: '#FF0420',
    logoUrl: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  },
  // BSC
  56: {
    id: 56,
    name: 'BNB Chain',
    shortName: 'BSC',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorer: 'https://bscscan.com',
    color: '#F0B90B',
    logoUrl: 'https://assets.coingecko.com/asset_platforms/images/1/large/bnb_smart_chain.png',
  },
  // Gnosis
  100: {
    id: 100,
    name: 'Gnosis',
    shortName: 'GNO',
    nativeCurrency: { name: 'xDai', symbol: 'XDAI', decimals: 18 },
    blockExplorer: 'https://gnosisscan.io',
    color: '#04795B',
  },
  // Polygon
  137: {
    id: 137,
    name: 'Polygon',
    shortName: 'MATIC',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorer: 'https://polygonscan.com',
    color: '#8247E5',
    logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  },
  // Fantom
  250: {
    id: 250,
    name: 'Fantom',
    shortName: 'FTM',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    blockExplorer: 'https://ftmscan.com',
    color: '#1969FF',
  },
  // zkSync Era
  324: {
    id: 324,
    name: 'zkSync Era',
    shortName: 'zkSync',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zksync.io',
    color: '#8C8DFC',
  },
  // Polygon zkEVM
  1101: {
    id: 1101,
    name: 'Polygon zkEVM',
    shortName: 'zkEVM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://zkevm.polygonscan.com',
    color: '#8247E5',
  },
  // Mantle
  5000: {
    id: 5000,
    name: 'Mantle',
    shortName: 'MNT',
    nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
    blockExplorer: 'https://explorer.mantle.xyz',
    color: '#000000',
  },
  // Base
  8453: {
    id: 8453,
    name: 'Base',
    shortName: 'BASE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://basescan.org',
    color: '#0052FF',
    logoUrl: 'https://pbs.twimg.com/profile_images/1945608199500910592/rnk6ixxH_400x400.jpg',
  },
  // Mode
  34443: {
    id: 34443,
    name: 'Mode',
    shortName: 'MODE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.mode.network',
    color: '#DFFE00',
  },
  // Arbitrum One
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://arbiscan.io',
    color: '#28A0F0',
    logoUrl: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  },
  // Arbitrum Nova
  42170: {
    id: 42170,
    name: 'Arbitrum Nova',
    shortName: 'NOVA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://nova.arbiscan.io',
    color: '#E57310',
  },
  // Avalanche C-Chain
  43114: {
    id: 43114,
    name: 'Avalanche',
    shortName: 'AVAX',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    blockExplorer: 'https://snowtrace.io',
    color: '#E84142',
    logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  },
  // Linea
  59144: {
    id: 59144,
    name: 'Linea',
    shortName: 'LINEA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://lineascan.build',
    color: '#121212',
  },
  // Blast
  81457: {
    id: 81457,
    name: 'Blast',
    shortName: 'BLAST',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://blastscan.io',
    color: '#FCFC03',
  },
  // Scroll
  534352: {
    id: 534352,
    name: 'Scroll',
    shortName: 'SCROLL',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://scrollscan.com',
    color: '#FFEEDA',
    logoUrl: 'https://assets.coingecko.com/coins/images/50571/standard/scroll.jpg?1728376125',
  },
  // Zora
  7777777: {
    id: 7777777,
    name: 'Zora',
    shortName: 'ZORA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zora.energy',
    color: '#000000',
  },
  // Hyper EVM
  999: {
    id: 999,
    name: 'Hyper EVM',
    shortName: 'HYPERLIQUID',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    blockExplorer: 'https://hyperevmscan.io',
    color: '#000000',
    logoUrl: 'https://assets.coingecko.com/asset_platforms/images/243/large/hyperliquid.png',
  },
  // Kaia
  8217: {
    id: 8217,
    name: 'Kaia Mainnet',
    shortName: 'KAIA',
    nativeCurrency: { name: 'Kaia', symbol: 'KAIA', decimals: 18 },
    blockExplorer: 'https://kaiascan.io',
    color: '#FF6B00',
    logoUrl: 'https://assets.coingecko.com/asset_platforms/images/9672/large/kaia.png',
  },
  // Monad
  41454: {
    id: 41454,
    name: 'Monad',
    shortName: 'MONAD',
    nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
    blockExplorer: 'https://monadvision.com',
    color: '#8B5CF6',
    logoUrl: 'https://assets.coingecko.com/coins/images/38927/large/monad.jpg',
  },
  // Sophon
  50104: {
    id: 50104,
    name: 'Sophon',
    shortName: 'SOPHON',
    nativeCurrency: { name: 'Sophon', symbol: 'SOPH', decimals: 18 },
    blockExplorer: 'https://explorer.sophon.xyz',
    color: '#6366F1',
    logoUrl: 'https://assets.coingecko.com/coins/images/38680/large/sophon_logo_200.png',
  },
};

// Helper function to get chain name
export function getChainName(chainId: number): string {
  return CHAINS[chainId]?.name ?? `Chain ${chainId}`;
}

// Helper function to get chain short name
export function getChainShortName(chainId: number): string {
  return CHAINS[chainId]?.shortName ?? `${chainId}`;
}

// Helper function to get chain color
export function getChainColor(chainId: number): string {
  return CHAINS[chainId]?.color ?? '#6B7280';
}

// Helper function to get chain logo
export function getChainLogo(chainId: number): string | undefined {
  return CHAINS[chainId]?.logoUrl;
}

// Helper function to get chain info
export function getChainInfo(chainId: number): ChainInfo {
  return (
    CHAINS[chainId] ?? {
      id: chainId,
      name: `Unknown Chain (${chainId})`,
      shortName: `${chainId}`,
      nativeCurrency: { name: 'Unknown', symbol: 'UNK', decimals: 18 },
      blockExplorer: '',
      color: '#6B7280',
    }
  );
}

// Get block explorer URL for transaction
export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const chain = CHAINS[chainId];
  if (!chain?.blockExplorer) return '';
  return `${chain.blockExplorer}/tx/${txHash}`;
}
