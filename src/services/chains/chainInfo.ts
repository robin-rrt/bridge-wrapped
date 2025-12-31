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
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040',
  },
  // Optimism
  10: {
    id: 10,
    name: 'Optimism',
    shortName: 'OP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://optimistic.etherscan.io',
    color: '#FF0420',
    logoUrl: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
  },
  // BSC
  56: {
    id: 56,
    name: 'BNB Chain',
    shortName: 'BSC',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorer: 'https://bscscan.com',
    color: '#F0B90B',
    logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=040',
  },
  // Gnosis
  100: {
    id: 100,
    name: 'Gnosis',
    shortName: 'GNO',
    nativeCurrency: { name: 'xDai', symbol: 'XDAI', decimals: 18 },
    blockExplorer: 'https://gnosisscan.io',
    color: '#04795B',
    logoUrl: 'https://cryptologos.cc/logos/gnosis-gno-gno-logo.png?v=040',
  },
  // Polygon
  137: {
    id: 137,
    name: 'Polygon',
    shortName: 'MATIC',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorer: 'https://polygonscan.com',
    color: '#8247E5',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=040',
  },
  // Fantom
  250: {
    id: 250,
    name: 'Fantom',
    shortName: 'FTM',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    blockExplorer: 'https://ftmscan.com',
    color: '#1969FF',
    logoUrl: 'https://cryptologos.cc/logos/fantom-ftm-logo.png?v=040',
  },
  // zkSync Era
  324: {
    id: 324,
    name: 'zkSync Era',
    shortName: 'zkSync',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zksync.io',
    color: '#8C8DFC',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zksync.svg',
  },
  // Polygon zkEVM
  1101: {
    id: 1101,
    name: 'Polygon zkEVM',
    shortName: 'zkEVM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://zkevm.polygonscan.com',
    color: '#8247E5',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=040',
  },
  // Mantle
  5000: {
    id: 5000,
    name: 'Mantle',
    shortName: 'MNT',
    nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
    blockExplorer: 'https://explorer.mantle.xyz',
    color: '#000000',
    logoUrl: 'https://cryptologos.cc/logos/mantle-mnt-logo.png?v=040',
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
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/mode.svg',
  },
  // Arbitrum One
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://arbiscan.io',
    color: '#28A0F0',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=040',
  },
  // Arbitrum Nova
  42170: {
    id: 42170,
    name: 'Arbitrum Nova',
    shortName: 'NOVA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://nova.arbiscan.io',
    color: '#E57310',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum_nova.svg',
  },
  // Avalanche C-Chain
  43114: {
    id: 43114,
    name: 'Avalanche',
    shortName: 'AVAX',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    blockExplorer: 'https://snowtrace.io',
    color: '#E84142',
    logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=040',
  },
  // Linea
  59144: {
    id: 59144,
    name: 'Linea',
    shortName: 'LINEA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://lineascan.build',
    color: '#121212',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/linea.svg',
  },
  // Blast
  81457: {
    id: 81457,
    name: 'Blast',
    shortName: 'BLAST',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://blastscan.io',
    color: '#FCFC03',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/blast.svg',
  },
  // Scroll
  534352: {
    id: 534352,
    name: 'Scroll',
    shortName: 'SCROLL',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://scrollscan.com',
    color: '#FFEEDA',
    logoUrl: 'https://assets.coingecko.com/coins/images/50571/large/scroll.jpg?1728376125',
  },
  // Zora
  7777777: {
    id: 7777777,
    name: 'Zora',
    shortName: 'ZORA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zora.energy',
    color: '#000000',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zora.svg',
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
  143: {
    id: 143,
    name: 'Monad',
    shortName: 'MONAD',
    nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
    blockExplorer: 'https://monadvision.com',
    color: '#8B5CF6',
    logoUrl: 'https://assets.coingecko.com/coins/images/38927/large/monad.jpg',
  },
  // Lens
  232: {
    id: 232,
    name: 'Lens Chains',
    shortName: 'LENS',
    nativeCurrency: { name: 'Gho', symbol: 'GHO', decimals: 18 },
    blockExplorer: 'https://explorer.lens.xyz',
    color: '#5cf666ff',
    logoUrl: 'https://pbs.twimg.com/profile_images/1856110197418438656/lktVUaQ2_400x400.jpg',
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
  // Unichain
  130: {
    id: 130,
    name: 'Unichain',
    shortName: 'UNI',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://uniscan.xyz',
    color: '#FF007A',
    logoUrl: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-logo.png',
  },
  // World Chain
  480: {
    id: 480,
    name: 'World Chain',
    shortName: 'WORLD',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://worldscan.org',
    color: '#000000',
    logoUrl: 'https://assets.coingecko.com/coins/images/31069/large/worldcoin.jpeg',
  },
  // Redstone
  690: {
    id: 690,
    name: 'Redstone',
    shortName: 'REDSTONE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.redstone.xyz',
    color: '#F04438',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/redstone.svg',
  },
  // Lisk
  1135: {
    id: 1135,
    name: 'Lisk',
    shortName: 'LSK',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://blockscout.lisk.com',
    color: '#0D76FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/385/large/Lisk_logo.png',
  },
  // Soneium
  1868: {
    id: 1868,
    name: 'Soneium',
    shortName: 'SONEIUM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://soneium.blockscout.com',
    color: '#6366F1',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/soneium.svg',
  },
  // Plasma
  9745: {
    id: 9745,
    name: 'Plasma',
    shortName: 'PLASMA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.plasma.network',
    color: '#8B5CF6',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/plasma.svg',
  },
  // Ink
  57073: {
    id: 57073,
    name: 'Ink',
    shortName: 'INK',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.inkonchain.com',
    color: '#7C3AED',
    logoUrl: 'https://assets.coingecko.com/asset_platforms/images/324/large/ink.jpeg',
  },
  // Solana (Virtual Chain ID for Across)
  34268394551451: {
    id: 34268394551451,
    name: 'Solana',
    shortName: 'SOL',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    blockExplorer: 'https://solscan.io',
    color: '#9945FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
  // Flare
  14: {
    id: 14,
    name: 'Flare',
    shortName: 'FLR',
    nativeCurrency: { name: 'Flare', symbol: 'FLR', decimals: 18 },
    blockExplorer: 'https://flare-explorer.flare.network',
    color: '#E62058',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/flare.svg',
  },
  // Cronos
  25: {
    id: 25,
    name: 'Cronos',
    shortName: 'CRO',
    nativeCurrency: { name: 'Cronos', symbol: 'CRO', decimals: 18 },
    blockExplorer: 'https://cronoscan.com',
    color: '#002D74',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/cronos.svg',
  },
  // Rootstock
  30: {
    id: 30,
    name: 'Rootstock',
    shortName: 'RBTC',
    nativeCurrency: { name: 'Rootstock Smart Bitcoin', symbol: 'RBTC', decimals: 18 },
    blockExplorer: 'https://explorer.rsk.co',
    color: '#FF9900',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/rootstock.svg',
  },
  // XDC
  50: {
    id: 50,
    name: 'XDC Network',
    shortName: 'XDC',
    nativeCurrency: { name: 'XDC', symbol: 'XDC', decimals: 18 },
    blockExplorer: 'https://xdc.blocksscan.io',
    color: '#1E5EFF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/xdc.svg',
  },
  // FUSE
  122: {
    id: 122,
    name: 'Fuse',
    shortName: 'FUSE',
    nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
    blockExplorer: 'https://explorer.fuse.io',
    color: '#B4F9BA',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fuse.svg',
  },
  // Sonic
  146: {
    id: 146,
    name: 'Sonic',
    shortName: 'S',
    nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
    blockExplorer: 'https://sonicscan.org',
    color: '#5B7FFF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/sonic.svg',
  },
  // opBNB
  204: {
    id: 204,
    name: 'opBNB',
    shortName: 'opBNB',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorer: 'https://opbnbscan.com',
    color: '#F0B90B',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/opbnb.svg',
  },
  // Fraxtal
  252: {
    id: 252,
    name: 'Fraxtal',
    shortName: 'FRAX',
    nativeCurrency: { name: 'Frax Ether', symbol: 'frxETH', decimals: 18 },
    blockExplorer: 'https://fraxscan.com',
    color: '#000000',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fraxtal.svg',
  },
  // Boba
  288: {
    id: 288,
    name: 'Boba',
    shortName: 'BOBA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://bobascan.com',
    color: '#1CD8D2',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/boba.svg',
  },
  // Flow
  747: {
    id: 747,
    name: 'Flow',
    shortName: 'FLOW',
    nativeCurrency: { name: 'Flow', symbol: 'FLOW', decimals: 18 },
    blockExplorer: 'https://www.flowdiver.io',
    color: '#00EF8B',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/flow.svg',
  },
  // Stable
  988: {
    id: 988,
    name: 'Stable',
    shortName: 'STABLE',
    nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
    blockExplorer: 'https://explorer.stable.com',
    color: '#00C853',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/stable.svg',
  },
  // Metis
  1088: {
    id: 1088,
    name: 'Metis',
    shortName: 'METIS',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    blockExplorer: 'https://andromeda-explorer.metis.io',
    color: '#00DACC',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/metis.svg',
  },
  // Moonbeam
  1284: {
    id: 1284,
    name: 'Moonbeam',
    shortName: 'GLMR',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    blockExplorer: 'https://moonscan.io',
    color: '#53CBC8',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonbeam.svg',
  },
  // Moonriver
  1285: {
    id: 1285,
    name: 'Moonriver',
    shortName: 'MOVR',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    blockExplorer: 'https://moonriver.moonscan.io',
    color: '#F2B705',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonriver.svg',
  },
  // Sei
  1329: {
    id: 1329,
    name: 'Sei',
    shortName: 'SEI',
    nativeCurrency: { name: 'Sei', symbol: 'SEI', decimals: 18 },
    blockExplorer: 'https://seitrace.com',
    color: '#9E1F19',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/sei.svg',
  },
  // Vana
  1480: {
    id: 1480,
    name: 'Vana',
    shortName: 'VANA',
    nativeCurrency: { name: 'Vana', symbol: 'VANA', decimals: 18 },
    blockExplorer: 'https://vanascan.io',
    color: '#8B5CF6',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/vana.svg',
  },
  // Gravity
  1625: {
    id: 1625,
    name: 'Gravity',
    shortName: 'G',
    nativeCurrency: { name: 'Gravity', symbol: 'G', decimals: 18 },
    blockExplorer: 'https://explorer.gravity.xyz',
    color: '#0066FF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/gravity.svg',
  },
  // Swellchain
  1923: {
    id: 1923,
    name: 'Swellchain',
    shortName: 'SWELL',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.swellnetwork.io',
    color: '#3068EF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/swell.svg',
  },
  // Ronin
  2020: {
    id: 2020,
    name: 'Ronin',
    shortName: 'RON',
    nativeCurrency: { name: 'Ronin', symbol: 'RON', decimals: 18 },
    blockExplorer: 'https://app.roninchain.com',
    color: '#1273EA',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ronin.svg',
  },
  // Abstract
  2741: {
    id: 2741,
    name: 'Abstract',
    shortName: 'ABS',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.abs.xyz',
    color: '#00FF88',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/abstract.svg',
  },
  // Immutable zkEVM
  13371: {
    id: 13371,
    name: 'Immutable zkEVM',
    shortName: 'IMX',
    nativeCurrency: { name: 'Immutable', symbol: 'IMX', decimals: 18 },
    blockExplorer: 'https://explorer.immutable.com',
    color: '#17B6C5',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/immutablezkevm.svg',
  },
  // Corn
  21000000: {
    id: 21000000,
    name: 'Corn',
    shortName: 'CORN',
    nativeCurrency: { name: 'Bitcorn', symbol: 'BTCN', decimals: 18 },
    blockExplorer: 'https://cornscan.io',
    color: '#FFCC00',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/corn.svg',
  },
  // Apechain
  33139: {
    id: 33139,
    name: 'ApeChain',
    shortName: 'APE',
    nativeCurrency: { name: 'ApeCoin', symbol: 'APE', decimals: 18 },
    blockExplorer: 'https://apescan.io',
    color: '#0047FF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/apechain.svg',
  },
  // Celo
  42220: {
    id: 42220,
    name: 'Celo',
    shortName: 'CELO',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    blockExplorer: 'https://celoscan.io',
    color: '#FCFF52',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/celo.svg',
  },
  // Etherlink
  42793: {
    id: 42793,
    name: 'Etherlink',
    shortName: 'XTZ',
    nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
    blockExplorer: 'https://explorer.etherlink.com',
    color: '#0D61FF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/etherlink.svg',
  },
  // Hemi
  43111: {
    id: 43111,
    name: 'Hemi',
    shortName: 'HEMI',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.hemi.xyz',
    color: '#FF5500',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/hemi.svg',
  },
  // Superposition
  55244: {
    id: 55244,
    name: 'Superposition',
    shortName: 'SPN',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.superposition.so',
    color: '#00D4FF',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/superposition.svg',
  },
  // BOB
  60808: {
    id: 60808,
    name: 'BOB',
    shortName: 'BOB',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.gobob.xyz',
    color: '#F25D00',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bob.svg',
  },
  // Berachain
  80094: {
    id: 80094,
    name: 'Berachain',
    shortName: 'BERA',
    nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
    blockExplorer: 'https://berascan.com',
    color: '#804819',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/berachain.svg',
  },
  // Plume
  98866: {
    id: 98866,
    name: 'Plume',
    shortName: 'PLUME',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.plume.network',
    color: '#E040FB',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/plume.svg',
  },
  // Taiko
  167000: {
    id: 167000,
    name: 'Taiko',
    shortName: 'TAIKO',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://taikoscan.io',
    color: '#E81899',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/taiko.svg',
  },
  // Katana
  747474: {
    id: 747474,
    name: 'Katana',
    shortName: 'KATANA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.katana.network',
    color: '#FF0000',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/katana.svg',
  },
  // Aurora
  1313161554: {
    id: 1313161554,
    name: 'Aurora',
    shortName: 'AOA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.aurora.dev',
    color: '#70D44B',
    logoUrl: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/aurora.svg',
  },
  // Manta Pacific
  169: {
    id: 169,
    name: 'Manta Pacific',
    shortName: 'MANTA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://pacific-explorer.manta.network',
    color: '#1E1E1E',
    logoUrl: 'https://assets.relay.link/icons/169/light.png',
  },
  // Shape
  360: {
    id: 360,
    name: 'Shape',
    shortName: 'SHAPE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://shapescan.xyz',
    color: '#000000',
    logoUrl: 'https://assets.relay.link/icons/360/light.png',
  },
  // AppChain
  466: {
    id: 466,
    name: 'AppChain',
    shortName: 'APP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.appchain.xyz',
    color: '#00C8FF',
    logoUrl: 'https://assets.relay.link/icons/466/light.png',
  },
  // Hyperliquid
  1337: {
    id: 1337,
    name: 'Hyperliquid',
    shortName: 'HYPE',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    blockExplorer: 'https://hyperliquid.xyz',
    color: '#00FF00',
    logoUrl: 'https://assets.relay.link/icons/1337/light.png',
  },
  // Perennial
  1424: {
    id: 1424,
    name: 'Perennial',
    shortName: 'PERENNIAL',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.perennial.finance',
    color: '#00FF88',
    logoUrl: 'https://assets.relay.link/icons/1424/light.png',
  },
  // Story
  1514: {
    id: 1514,
    name: 'Story',
    shortName: 'STORY',
    nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
    blockExplorer: 'https://storyscan.io',
    color: '#FF6B00',
    logoUrl: 'https://assets.relay.link/icons/1514/light.png',
  },
  // Sanko
  1996: {
    id: 1996,
    name: 'Sanko',
    shortName: 'SANKO',
    nativeCurrency: { name: 'DMT', symbol: 'DMT', decimals: 18 },
    blockExplorer: 'https://explorer.sanko.xyz',
    color: '#FF00FF',
    logoUrl: 'https://assets.relay.link/icons/1996/light.png',
  },
  // Morph
  2818: {
    id: 2818,
    name: 'Morph',
    shortName: 'MORPH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.morphl2.io',
    color: '#00D084',
    logoUrl: 'https://assets.relay.link/icons/2818/light.png',
  },
  // Somnia
  5031: {
    id: 5031,
    name: 'Somnia',
    shortName: 'SOMNIA',
    nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
    blockExplorer: 'https://explorer.somnia.network',
    color: '#8B5CF6',
    logoUrl: 'https://assets.relay.link/icons/5031/light.png',
  },
  // Superseed
  5330: {
    id: 5330,
    name: 'Superseed',
    shortName: 'SUPERSEED',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.superseed.xyz',
    color: '#00C853',
    logoUrl: 'https://assets.relay.link/icons/5330/light.png',
  },
  // Cyber
  7560: {
    id: 7560,
    name: 'Cyber',
    shortName: 'CYBER',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://cyberscan.co',
    color: '#00FF9D',
    logoUrl: 'https://assets.relay.link/icons/7560/light.png',
  },
  // Powerloom v2
  7869: {
    id: 7869,
    name: 'Powerloom v2',
    shortName: 'POWERLOOM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.powerloom.io',
    color: '#6366F1',
    logoUrl: 'https://assets.relay.link/icons/7869/light.png',
  },
  // Arena-Z
  7897: {
    id: 7897,
    name: 'Arena-Z',
    shortName: 'ARENA',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.arena-z.xyz',
    color: '#FF4500',
    logoUrl: 'https://assets.relay.link/icons/7897/light.png',
  },
  // B3
  8333: {
    id: 8333,
    name: 'B3',
    shortName: 'B3',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.b3.fun',
    color: '#000000',
    logoUrl: 'https://assets.relay.link/icons/8333/light.png',
  },
  // Funki
  33979: {
    id: 33979,
    name: 'Funki',
    shortName: 'FUNKI',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://funkiscan.io',
    color: '#FF69B4',
    logoUrl: 'https://assets.relay.link/icons/33979/light.png',
  },
  // Mythos
  42018: {
    id: 42018,
    name: 'Mythos',
    shortName: 'MYTH',
    nativeCurrency: { name: 'MYTH', symbol: 'MYTH', decimals: 18 },
    blockExplorer: 'https://explorer.mythos.network',
    color: '#FF6600',
    logoUrl: 'https://assets.relay.link/icons/42018/light.png',
  },
  // Gunz
  43419: {
    id: 43419,
    name: 'Gunz',
    shortName: 'GUN',
    nativeCurrency: { name: 'GUN', symbol: 'GUN', decimals: 18 },
    blockExplorer: 'https://explorer.gunz.io',
    color: '#FF0000',
    logoUrl: 'https://assets.relay.link/icons/43419/light.png',
  },
  // Zircuit
  48900: {
    id: 48900,
    name: 'Zircuit',
    shortName: 'ZRC',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zircuit.com',
    color: '#00FF00',
    logoUrl: 'https://assets.relay.link/icons/48900/light.png',
  },
  // Animechain
  69000: {
    id: 69000,
    name: 'Animechain',
    shortName: 'ANIME',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.animechain.ai',
    color: '#FF1493',
    logoUrl: 'https://assets.relay.link/icons/69000/light.png',
  },
  // Syndicate
  510003: {
    id: 510003,
    name: 'Syndicate',
    shortName: 'SYNDICATE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.syndicate.io',
    color: '#6366F1',
    logoUrl: 'https://assets.relay.link/icons/510003/light.png',
  },
  // Zero Network
  543210: {
    id: 543210,
    name: 'Zero Network',
    shortName: 'ZERO',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.zero.network',
    color: '#000000',
    logoUrl: 'https://assets.relay.link/icons/543210/light.png',
  },
  // Xai
  660279: {
    id: 660279,
    name: 'Xai',
    shortName: 'XAI',
    nativeCurrency: { name: 'XAI', symbol: 'XAI', decimals: 18 },
    blockExplorer: 'https://explorer.xai-chain.net',
    color: '#F30019',
    logoUrl: 'https://assets.relay.link/icons/660279/light.png',
  },
  // Forma
  984122: {
    id: 984122,
    name: 'Forma',
    shortName: 'TIA',
    nativeCurrency: { name: 'TIA', symbol: 'TIA', decimals: 18 },
    blockExplorer: 'https://explorer.forma.art',
    color: '#00C8FF',
    logoUrl: 'https://assets.relay.link/icons/984122/light.png',
  },
  // Ethereal
  5064014: {
    id: 5064014,
    name: 'Ethereal',
    shortName: 'ETHEREAL',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.ethereal.network',
    color: '#8B5CF6',
    logoUrl: 'https://assets.relay.link/icons/5064014/light.png',
  },
  // Bitcoin (via Relay)
  8253038: {
    id: 8253038,
    name: 'Bitcoin',
    shortName: 'BTC',
    nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
    blockExplorer: 'https://mempool.space',
    color: '#F7931A',
    logoUrl: 'https://assets.relay.link/icons/8253038/light.png',
  },
  // Eclipse
  9286185: {
    id: 9286185,
    name: 'Eclipse',
    shortName: 'ECLIPSE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.eclipse.xyz',
    color: '#8B5CF6',
    logoUrl: 'https://assets.relay.link/icons/9286185/light.png',
  },
  // Soon
  9286186: {
    id: 9286186,
    name: 'Soon',
    shortName: 'SOON',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://explorer.soo.network',
    color: '#00FF88',
    logoUrl: 'https://assets.relay.link/icons/9286186/light.png',
  },
  // Degen
  666666666: {
    id: 666666666,
    name: 'Degen',
    shortName: 'DEGEN',
    nativeCurrency: { name: 'DEGEN', symbol: 'DEGEN', decimals: 18 },
    blockExplorer: 'https://explorer.degen.tips',
    color: '#A36EFD',
    logoUrl: 'https://assets.relay.link/icons/666666666/light.png',
  },
  // Tron
  728126428: {
    id: 728126428,
    name: 'Tron',
    shortName: 'TRX',
    nativeCurrency: { name: 'Tron', symbol: 'TRX', decimals: 6 },
    blockExplorer: 'https://tronscan.org',
    color: '#FF0013',
    logoUrl: 'https://assets.relay.link/icons/728126428/light.png',
  },
  // Solana (Relay chainId - maps to same chain as 34268394551451)
  792703809: {
    id: 792703809,
    name: 'Solana',
    shortName: 'SOL',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    blockExplorer: 'https://solscan.io',
    color: '#9945FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
  // Ancient8
  888888888: {
    id: 888888888,
    name: 'Ancient8',
    shortName: 'A8',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://scan.ancient8.gg',
    color: '#FFD700',
    logoUrl: 'https://assets.relay.link/icons/888888888/light.png',
  },
  // RARI
  1380012617: {
    id: 1380012617,
    name: 'RARI Chain',
    shortName: 'RARI',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://mainnet.explorer.rarichain.org',
    color: '#FEDA03',
    logoUrl: 'https://assets.relay.link/icons/1380012617/light.png',
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
