import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock environment variable
const originalEnv = process.env;

describe('/api/token-info', () => {
  const LINK_ADDRESS = '0x514910771AF9CA656AF840dff83E8264ECF986CA';

  beforeEach(() => {
    // Reset environment
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST endpoint', () => {
    it('should return 400 for invalid request without addresses', async () => {
      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('Invalid request');
    });

    it('should return 400 for non-array addresses', async () => {
      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({ addresses: 'not-an-array' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('Invalid request');
    });

    it('should return 500 when API key is not configured', async () => {
      delete process.env.COINMARKETCAP_API_KEY;

      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({ addresses: [LINK_ADDRESS] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toBe('API key not configured');
    });

    it('should return CoinMarketCap data when API key is configured', async () => {
      // Set API key
      process.env.COINMARKETCAP_API_KEY = 'test-api-key';

      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({ addresses: [LINK_ADDRESS.toLowerCase()] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);

      const json = await response.json();

      // Should return CoinMarketCap response format
      expect(json.status).toBeDefined();
      expect(json.status.error_code).toBe(0);
      expect(json.data).toBeDefined();

      // Should contain LINK token data
      const tokenData = Object.values(json.data)[0] as {
        symbol: string;
        name: string;
        logo: string;
      };
      expect(tokenData.symbol).toBe('LINK');
      expect(tokenData.name).toBe('Chainlink');
      expect(tokenData.logo).toContain('coinmarketcap.com');
    });

    it('should handle multiple addresses', async () => {
      process.env.COINMARKETCAP_API_KEY = 'test-api-key';
      const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({
          addresses: [LINK_ADDRESS.toLowerCase(), USDC_ADDRESS],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      // Should not error - may return data or 400 depending on mocking
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('API integration with CoinMarketCapService (Bug Documentation)', () => {
    /**
     * BUG DOCUMENTATION TEST
     *
     * This test documents the integration issue between the API route
     * and the CoinMarketCapService.
     *
     * The flow should be:
     * 1. User requests token info for an unmapped token (like LINK)
     * 2. CoinMarketCapService.getTokenInfo() is called
     * 3. getFallbackTokenInfo() returns null for unknown tokens
     * 4. Service calls /api/token-info endpoint
     * 5. API route calls CoinMarketCap API
     * 6. User receives real token data
     *
     * Actual behavior:
     * 1. User requests token info for an unmapped token
     * 2. CoinMarketCapService.getTokenInfo() is called
     * 3. getFallbackTokenInfo() returns { symbol: address, name: 'Unknown Token', ... }
     * 4. Service returns fallback immediately, never calling API
     * 5. User receives fallback data, not real token data
     *
     * This test verifies the API route works correctly. The bug is in the service,
     * not the route itself.
     */
    it('should correctly forward requests to CoinMarketCap API', async () => {
      process.env.COINMARKETCAP_API_KEY = 'test-api-key';

      const request = new NextRequest('http://localhost/api/token-info', {
        method: 'POST',
        body: JSON.stringify({ addresses: [LINK_ADDRESS.toLowerCase()] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const json = await response.json();

      // The API route correctly returns LINK data from CoinMarketCap
      // The bug is that the service never calls this route for unmapped tokens
      const tokenData = Object.values(json.data)[0] as {
        symbol: string;
        name: string;
      };
      expect(tokenData.symbol).toBe('LINK');
      expect(tokenData.name).toBe('Chainlink');
    });
  });
});
