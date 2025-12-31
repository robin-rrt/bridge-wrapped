import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coinMarketCapService } from '../coinmarketcap';

describe('CoinMarketCapService', () => {
  const LINK_ADDRESS = '0x514910771AF9CA656AF840dff83E8264ECF986CA';

  beforeEach(() => {
    // Clear any cached values
    coinMarketCapService.clearCache();
  });

  describe('getTokenInfo - unmapped tokens', () => {
    /**
     * BUG DOCUMENTATION TEST
     *
     * This test documents a critical bug in the CoinMarketCapService:
     * The getFallbackTokenInfo method ALWAYS returns a value (never null),
     * which means the CoinMarketCap API is NEVER called for unknown tokens.
     *
     * Current behavior:
     * - getFallbackTokenInfo returns { symbol: address, name: 'Unknown Token', decimals: 18 }
     * - This means line 102 (if (fallbackInfo)) is always true
     * - Lines 107-127 (API call) are dead code
     *
     * Expected behavior:
     * - getFallbackTokenInfo should return null for unknown tokens
     * - The API should be called to get real token info
     */
    it('should call CoinMarketCap API for tokens not in fallback list', async () => {
      // Spy on fetch to verify API is called
      const fetchSpy = vi.spyOn(global, 'fetch');

      const result = await coinMarketCapService.getTokenInfo(LINK_ADDRESS);

      // The API should be called for LINK since it's not in our fallback list
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/token-info'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Should return actual token data, not fallback
      expect(result?.symbol).toBe('LINK');
      expect(result?.name).toBe('Chainlink');
      expect(result?.symbol).not.toBe(LINK_ADDRESS); // Should NOT be the address
      expect(result?.name).not.toBe('Unknown Token'); // Should NOT be fallback
    });

    /**
     * BUG DOCUMENTATION TEST
     *
     * This test verifies that unmapped tokens receive real data from CoinMarketCap,
     * NOT the fallback "Unknown Token" data.
     */
    it('should NOT return fallback data for valid unmapped tokens', async () => {
      const result = await coinMarketCapService.getTokenInfo(LINK_ADDRESS);

      // THIS TEST WILL FAIL - documenting the bug
      // Current behavior: returns { symbol: address, name: 'Unknown Token', decimals: 18 }
      // Expected behavior: returns { symbol: 'LINK', name: 'Chainlink', ... }
      //
      // We check the name specifically since the bug causes "Unknown Token" to be returned
      expect(result?.name).not.toBe('Unknown Token');
    });

    /**
     * BUG DOCUMENTATION TEST
     *
     * This test verifies that the symbol returned is NOT the raw address.
     */
    it('should return a proper symbol, not the address', async () => {
      const result = await coinMarketCapService.getTokenInfo(LINK_ADDRESS);

      // THIS TEST WILL FAIL - documenting the bug
      // The symbol should be "LINK", not the full address
      expect(result?.symbol.length).toBeLessThan(10); // Real symbols are short
      expect(result?.symbol).toBe('LINK');
    });
  });

  describe('getFallbackTokenInfo - known tokens', () => {
    it('should return fallback for USDC addresses', async () => {
      const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const result = await coinMarketCapService.getTokenInfo(USDC_ETH);

      expect(result?.symbol).toBe('USDC');
      expect(result?.name).toBe('USD Coin');
      expect(result?.decimals).toBe(6);
    });

    it('should return fallback for WETH addresses', async () => {
      const WETH_ETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
      const result = await coinMarketCapService.getTokenInfo(WETH_ETH);

      expect(result?.symbol).toBe('WETH');
      expect(result?.name).toBe('Wrapped Ethereum');
      expect(result?.decimals).toBe(18);
    });

    it('should return fallback for ETH zero address', async () => {
      const ETH_ZERO = '0x0000000000000000000000000000000000000000';
      const result = await coinMarketCapService.getTokenInfo(ETH_ZERO);

      expect(result?.symbol).toBe('ETH');
      expect(result?.name).toBe('Ethereum');
      expect(result?.decimals).toBe(18);
    });

    it('should return fallback for USDT addresses', async () => {
      const USDT_ETH = '0xdac17f958d2ee523a2206206994597c13d831ec7';
      const result = await coinMarketCapService.getTokenInfo(USDT_ETH);

      expect(result?.symbol).toBe('USDT');
      expect(result?.name).toBe('Tether USD');
      expect(result?.decimals).toBe(6);
    });

    it('should return fallback for DAI addresses', async () => {
      const DAI_ETH = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const result = await coinMarketCapService.getTokenInfo(DAI_ETH);

      expect(result?.symbol).toBe('DAI');
      expect(result?.name).toBe('Dai Stablecoin');
      expect(result?.decimals).toBe(18);
    });
  });

  describe('caching behavior', () => {
    it('should cache token info and return cached value on subsequent calls', async () => {
      const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

      const result1 = await coinMarketCapService.getTokenInfo(USDC_ETH);
      const result2 = await coinMarketCapService.getTokenInfo(USDC_ETH);

      expect(result1).toEqual(result2);
    });

    it('should clear cache when clearCache is called', async () => {
      const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

      await coinMarketCapService.getTokenInfo(USDC_ETH);
      coinMarketCapService.clearCache();

      // After clearing, the service should re-fetch (or re-compute fallback)
      const result = await coinMarketCapService.getTokenInfo(USDC_ETH);
      expect(result?.symbol).toBe('USDC');
    });
  });
});
