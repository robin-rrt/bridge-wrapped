interface CoinMarketCapTokenInfo {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  logo: string;
  description: string;
  date_added: string;
  date_launched: string | null;
  tags: string[];
  platform?: {
    name: string;
    token_address: string;
  } | null;
  category: string;
  urls?: {
    website?: string[];
    technical_doc?: string[];
    twitter?: string[];
    explorer?: string[];
    source_code?: string[];
  };
}

interface CoinMarketCapResponse {
  data: {
    [key: string]: CoinMarketCapTokenInfo;
  };
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
}

interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

const SymbolToLogo: { [k: string]: string } = {
  BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=040',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=040',
  DAI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=040',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040',
  KAIA: 'https://cryptologos.cc/logos/kaia-kaia-logo.png?v=040',
  MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=040',
  MON: 'https://assets.coingecko.com/coins/images/38927/large/monad.jpg',
  POL: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=040',
  SOPH: 'https://assets.coingecko.com/coins/images/38680/large/sophon_logo_200.png',
  USDC: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
  USDT: 'https://coin-images.coingecko.com/coins/images/35023/large/USDT.png',
  WETH: 'https://coin-images.coingecko.com/coins/images/2518/large/weth.png',
  HYPE: 'https://assets.coingecko.com/coins/images/50882/large/hyperliquid.jpg',
};

class CoinMarketCapService {
  private cache: Map<string, { data: TokenInfo; timestamp: number }> = new Map();
  private cacheExpiry = 1000 * 60 * 60; // 1 hour cache

  private async fetchFromAPI(addresses: string[]): Promise<CoinMarketCapResponse | null> {
    try {
      const response = await fetch('/api/token-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresses }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token info API error:', response.status, response.statusText, errorText);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching from token info API:', error);
      return null;
    }
  }

  async getTokenInfo(address: string): Promise<TokenInfo | null> {
    const lowerAddress = address.toLowerCase();

    // Check cache first
    const cached = this.cache.get(lowerAddress);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Always get fallback info first (includes decimals and logos)
    const fallbackInfo = this.getFallbackTokenInfo(address);

    // Cache and return fallback info
    if (fallbackInfo) {
      this.cache.set(lowerAddress, { data: fallbackInfo, timestamp: Date.now() });
      return fallbackInfo;
    }

    // Try fetching from CoinMarketCap API for unknown tokens
    // This is mainly for getting decimals and symbol info
    // Note: Pricing data should come from the bridge APIs as they're more current
    try {
      const response = await this.fetchFromAPI([lowerAddress]);
      if (response && response.status.error_code === 0) {
        const tokenData = Object.values(response.data)[0];
        if (tokenData) {
          const info: TokenInfo = {
            symbol: tokenData.symbol,
            name: tokenData.name,
            decimals: this.getDecimalsForToken(tokenData.symbol),
            logo: tokenData.logo,
          };
          this.cache.set(lowerAddress, { data: info, timestamp: Date.now() });
          return info;
        }
      }
    } catch (error) {
      console.warn('CoinMarketCap API error for address:', lowerAddress, error);
    }

    return null;
  }

  async getMultipleTokenInfo(addresses: string[]): Promise<Map<string, TokenInfo>> {
    const results = new Map<string, TokenInfo>();

    // Process each address using fallback info
    for (const address of addresses) {
      const lowerAddress = address.toLowerCase();

      // Check cache first
      const cached = this.cache.get(lowerAddress);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        results.set(lowerAddress, cached.data);
        continue;
      }

      // Get fallback info
      const fallback = this.getFallbackTokenInfo(address);
      if (fallback) {
        this.cache.set(lowerAddress, { data: fallback, timestamp: Date.now() });
        results.set(lowerAddress, fallback);
      }
    }

    return results;
  }

  private getFallbackTokenInfo(address: string): TokenInfo | null {
    const lowerAddress = address.toLowerCase();

    // Handle special ETH addresses
    if (
      lowerAddress === '0x0000000000000000000000000000000000000000' ||
      lowerAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ) {
      return {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logo: SymbolToLogo.ETH,
      };
    }

    // WETH addresses across different chains
    const wethAddresses = [
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // Ethereum mainnet
      '0x4200000000000000000000000000000000000006', // Base, Optimism, Mode (native wrapped)
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // Arbitrum
      '0x5300000000000000000000000000000000000004', // Scroll
      '0x4200000000000000000000000000000000000006', // zkSync Era
    ];

    if (wethAddresses.includes(lowerAddress)) {
      return {
        symbol: 'WETH',
        name: 'Wrapped Ethereum',
        decimals: 18,
        logo: SymbolToLogo.WETH,
      };
    }

    // USDC addresses across different chains
    const usdcAddresses = [
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Ethereum
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // Arbitrum
      '0x0b2c639c533813f4aa9d7837caf62653d097ff85', // Optimism
      '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base
      '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', // Polygon
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // Polygon (old)
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // BSC
      '0x5425890298aed601595a70ab815c96711a31bc65', // Arbitrum Nova
      '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4', // Scroll
      '0x06a78e50142a4e9b2c6b49d47e5f0d1e1db33428', // Scroll (alt)
      '0x176211869ca2b568f2a7d4ee941e073a821ee1ff', // Linea
      '0x750ba8b76187092b0d1e87e28daaf484d1b5273b', // zkSync
      '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4', // Zora
      '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9', // Polygon zkEVM
      '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035', // Polygon zkEVM (alt)
      '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', // Mode
    ];

    if (usdcAddresses.includes(lowerAddress)) {
      return {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logo: SymbolToLogo.USDC,
      };
    }

    // USDT addresses across different chains
    const usdtAddresses = [
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // Ethereum
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // Arbitrum
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // Optimism
      '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', // Avalanche C-Chain
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // Polygon
      '0x55d398326f99059ff775485246999027b3197955', // BSC
      '0xf417f5a458ec102b90352f697d6e2ac3a3d2851f', // Polygon zkEVM
      '0x1e4a5963abfd975d8c9021ce480b42188849d41d', // Arbitrum Nova
      '0xf0f161fda2712db8b566946122a5af183995e2ed', // Avalanche (Bridged)
      '0x493257fd37edb34451f62edf8d2a0c418852ba4c', // zkSync Era
      '0x68f180fcce6836688e9084f035309e29bf0a2095', // Base
    ];

    if (usdtAddresses.includes(lowerAddress)) {
      return {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logo: SymbolToLogo.USDT,
      };
    }

    // DAI addresses across different chains
    const daiAddresses = [
      '0x6b175474e89094c44da98b954eedeac495271d0f', // Ethereum
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // Arbitrum, Optimism, Base
      '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // Polygon
      '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // BSC
      '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // Avalanche C-Chain
    ];

    if (daiAddresses.includes(lowerAddress)) {
      return {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logo: SymbolToLogo.DAI,
      };
    }

    // If no fallback found, return address as symbol
    return {
      symbol: address,
      name: 'Unknown Token',
      decimals: 18, // Default to 18 decimals
    };
  }

  private getDecimalsForToken(symbol: string): number {
    // Common stablecoins use 6 decimals
    const sixDecimalTokens = ['USDC', 'USDT'];
    if (sixDecimalTokens.includes(symbol.toUpperCase())) {
      return 6;
    }

    // Most other tokens use 18 decimals
    return 18;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const coinMarketCapService = new CoinMarketCapService();
export type { TokenInfo };
