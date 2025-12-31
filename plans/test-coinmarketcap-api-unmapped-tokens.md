# Test CoinMarketCap API for Unmapped Tokens

**Type:** Bug Documentation / Test Implementation
**Priority:** High
**Date:** 2025-01-01

---

## Overview

Write a test to document and verify that the CoinMarketCap API calls are working as intended for unmapped tokens. This test will **document an existing bug** where the CoinMarketCap API is never actually called for unknown tokens.

### Critical Bug Discovered

The `getFallbackTokenInfo` method in `/src/services/tokens/coinmarketcap.ts` **always returns a value** (never null), which means:
- The CoinMarketCap API is **NEVER called** for unknown tokens
- The API call code (lines 107-127) is essentially **dead code**
- Unknown tokens always receive: `{ symbol: address, name: 'Unknown Token', decimals: 18 }`

---

## Problem Statement

When a token address is not in our hardcoded fallback list (WETH, USDC, USDT, DAI, ETH), the system should query the CoinMarketCap API to retrieve token metadata. However, the current implementation has a logic flaw:

```typescript
// Current behavior in getFallbackTokenInfo (lines 262-268):
// If no fallback found, return address as symbol
return {
  symbol: address,        // Uses the raw address as symbol
  name: 'Unknown Token',
  decimals: 18,           // Default to 18 decimals
};
```

This default return statement causes `fallbackInfo` to never be null, so the condition to call CMC (line 106: `if (!fallbackInfo)`) is never true.

---

## Proposed Solution

Create a failing test that documents this bug, setting up the infrastructure for future bug fixes.

### Test Token Address

```
0x514910771AF9CA656AF840dff83E8264ECF986CA
```
- **Token:** Chainlink (LINK)
- **Chain:** Ethereum Mainnet
- **Status:** NOT in our hardcoded fallback list, but IS a valid token on CoinMarketCap

---

## Technical Approach

### Architecture

```
src/
├── services/
│   └── tokens/
│       ├── coinmarketcap.ts          # Service under test
│       └── __tests__/
│           └── coinmarketcap.test.ts # NEW: Test file
├── app/
│   └── api/
│       └── token-info/
│           ├── route.ts              # API route
│           └── route.test.ts         # NEW: Integration test
└── mocks/
    └── handlers.ts                   # NEW: MSW handlers
```

### Implementation Phases

#### Phase 1: Test Infrastructure Setup

**Tasks:**
- [ ] Install test dependencies (vitest, msw, next-test-api-route-handler)
- [ ] Create vitest.config.ts
- [ ] Create test setup file with MSW server
- [ ] Create MSW handlers for CoinMarketCap API

**Files to create:**

`vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

`vitest.setup.ts`
```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

`src/mocks/handlers.ts`
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info', ({ request }) => {
    const url = new URL(request.url);
    const address = url.searchParams.get('address');

    // Mock response for LINK token
    if (address?.toLowerCase() === '0x514910771af9ca656af840dff83e8264ecf986ca') {
      return HttpResponse.json({
        status: { error_code: 0, error_message: null },
        data: {
          '1975': {
            id: 1975,
            name: 'Chainlink',
            symbol: 'LINK',
            slug: 'chainlink',
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
            description: 'Chainlink (LINK) is a decentralized oracle network...',
            platform: {
              name: 'Ethereum',
              token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            },
          },
        },
      });
    }

    // 404 for unknown tokens
    return HttpResponse.json(
      { status: { error_code: 400, error_message: 'Invalid value for address' } },
      { status: 400 }
    );
  }),
];
```

`src/mocks/server.ts`
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

#### Phase 2: Unit Test for CoinMarketCap Service

**File:** `src/services/tokens/__tests__/coinmarketcap.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coinMarketCapService } from '../coinmarketcap';

describe('CoinMarketCapService', () => {
  const LINK_ADDRESS = '0x514910771AF9CA656AF840dff83E8264ECF986CA';

  beforeEach(() => {
    // Clear any cached values
    coinMarketCapService.clearCache?.();
  });

  describe('getTokenInfo - unmapped tokens', () => {
    it('should call CoinMarketCap API for tokens not in fallback list', async () => {
      // Spy on fetch to verify API is called
      const fetchSpy = vi.spyOn(global, 'fetch');

      const result = await coinMarketCapService.getTokenInfo(LINK_ADDRESS);

      // THIS TEST WILL FAIL - documenting the bug
      // The API should be called for LINK since it's not in our fallback list
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/token-info'),
        expect.any(Object)
      );

      // Should return actual token data, not fallback
      expect(result.symbol).toBe('LINK');
      expect(result.name).toBe('Chainlink');
      expect(result.symbol).not.toBe(LINK_ADDRESS); // Should NOT be the address
      expect(result.name).not.toBe('Unknown Token'); // Should NOT be fallback
    });

    it('should NOT return fallback data for valid unmapped tokens', async () => {
      const result = await coinMarketCapService.getTokenInfo(LINK_ADDRESS);

      // THIS TEST WILL FAIL - documenting the bug
      // Current behavior: returns { symbol: address, name: 'Unknown Token', decimals: 18 }
      // Expected behavior: returns { symbol: 'LINK', name: 'Chainlink', ... }
      expect(result).not.toEqual({
        symbol: LINK_ADDRESS,
        name: 'Unknown Token',
        decimals: 18,
      });
    });
  });

  describe('getFallbackTokenInfo - known tokens', () => {
    it('should return fallback for USDC addresses', async () => {
      const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const result = await coinMarketCapService.getTokenInfo(USDC_ETH);

      expect(result.symbol).toBe('USDC');
      expect(result.name).toBe('USD Coin');
      expect(result.decimals).toBe(6);
    });

    it('should return fallback for WETH addresses', async () => {
      const WETH_ETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
      const result = await coinMarketCapService.getTokenInfo(WETH_ETH);

      expect(result.symbol).toBe('WETH');
      expect(result.name).toBe('Wrapped Ether');
      expect(result.decimals).toBe(18);
    });
  });
});
```

#### Phase 3: Integration Test for API Route

**File:** `src/app/api/token-info/route.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';

describe('/api/token-info', () => {
  const LINK_ADDRESS = '0x514910771AF9CA656AF840dff83E8264ECF986CA';

  it('should return CoinMarketCap data for unmapped tokens', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher: (request) => {
        return new Request(
          `http://localhost/api/token-info?address=${LINK_ADDRESS}`,
          request
        );
      },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);

        // THIS TEST WILL FAIL - documenting the bug
        expect(json.symbol).toBe('LINK');
        expect(json.name).toBe('Chainlink');
        expect(json.logo).toContain('coinmarketcap.com');
      },
    });
  });

  it('should return 400 for invalid addresses', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher: (request) => {
        return new Request(
          'http://localhost/api/token-info?address=invalid',
          request
        );
      },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
      },
    });
  });
});
```

---

## Acceptance Criteria

### Functional Requirements

- [ ] Test infrastructure is set up (Vitest, MSW)
- [ ] Unit test exists for `coinMarketCapService.getTokenInfo()` with unmapped token
- [ ] Integration test exists for `/api/token-info` route
- [ ] Tests correctly document the bug (they FAIL with current implementation)
- [ ] Tests use the specified LINK token address

### Non-Functional Requirements

- [ ] Tests run in < 5 seconds
- [ ] Tests are deterministic (mocked external calls)
- [ ] Tests have clear failure messages explaining the bug

### Quality Gates

- [ ] `npm test` runs without errors (tests marked as expected to fail)
- [ ] Test coverage for coinmarketcap.ts service

---

## Success Metrics

1. **Bug Documentation:** Failing tests clearly show the CoinMarketCap API is never called
2. **Future Fix Verification:** When the bug is fixed, tests will pass automatically
3. **Regression Prevention:** Tests will catch if the bug is reintroduced

---

## Dependencies & Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install -D vitest @vitejs/plugin-react msw next-test-api-route-handler
   ```

2. **Environment Variables:**
   - `CMC_API_KEY` - CoinMarketCap API key (for future real API testing)

---

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| MSW not intercepting Next.js API routes | Tests fail unexpectedly | Use `next-test-api-route-handler` for route testing |
| Vitest config conflicts with Next.js | Build issues | Use separate test config, not affecting production |
| Test tokens get added to fallback list | Tests become invalid | Use LINK address which is unlikely to be hardcoded |

---

## Future Considerations

### Bug Fix Strategy (for later)

When fixing the bug, modify `getFallbackTokenInfo` to return `null` for unknown tokens:

```typescript
// In getFallbackTokenInfo, change the final return to:
return null; // Let caller know this token is truly unknown

// Then in getTokenInfo, the API call will execute:
if (!fallbackInfo) {
  // This code will now actually run for unknown tokens
  const response = await fetch(`/api/token-info?address=${address}`);
  // ...
}
```

---

## References & Research

### Internal References
- Service implementation: `src/services/tokens/coinmarketcap.ts:89-130`
- Fallback logic bug: `src/services/tokens/coinmarketcap.ts:262-268`
- API route: `src/app/api/token-info/route.ts`

### External References
- [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/)
- [MSW Documentation](https://mswjs.io/docs/)
- [next-test-api-route-handler](https://www.npmjs.com/package/next-test-api-route-handler)
- [Vitest Documentation](https://vitest.dev/guide/)

### Test Token
- **Address:** `0x514910771AF9CA656AF840dff83E8264ECF986CA`
- **Token:** Chainlink (LINK)
- **CoinMarketCap ID:** 1975
- **Chain:** Ethereum Mainnet
