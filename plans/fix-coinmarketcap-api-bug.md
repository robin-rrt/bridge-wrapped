# Fix: CoinMarketCap API Never Called for Unmapped Tokens

**Type:** Bug Fix
**Priority:** High
**Date:** 2025-01-01

---

## Problem Statement

The `getFallbackTokenInfo` method in `src/services/tokens/coinmarketcap.ts` **always returns a value** (never null), causing the CoinMarketCap API to never be called for unknown tokens.

**Current behavior (lines 262-267):**
```typescript
// If no fallback found, return address as symbol
return {
  symbol: address,
  name: 'Unknown Token',
  decimals: 18,
};
```

This means `fallbackInfo` is never null, so line 102 `if (fallbackInfo)` is always true, and lines 107-127 (API call) are dead code.

---

## Proposed Solution

Change `getFallbackTokenInfo` to return `null` for unknown tokens instead of the default object.

**File:** `src/services/tokens/coinmarketcap.ts`

**Change lines 262-267 from:**
```typescript
// If no fallback found, return address as symbol
return {
  symbol: address,
  name: 'Unknown Token',
  decimals: 18,
};
```

**To:**
```typescript
// No fallback found - return null to trigger API call
return null;
```

---

## Acceptance Criteria

- [ ] `getFallbackTokenInfo` returns `null` for unknown token addresses
- [ ] CoinMarketCap API is called for tokens not in the fallback list
- [ ] All 3 failing tests pass:
  - `should call CoinMarketCap API for tokens not in fallback list`
  - `should NOT return fallback data for valid unmapped tokens`
  - `should return a proper symbol, not the address`
- [ ] Existing 13 passing tests continue to pass

---

## References

- Bug documentation: `plans/test-coinmarketcap-api-unmapped-tokens.md`
- Tests: `src/services/tokens/__tests__/coinmarketcap.test.ts`
- Service: `src/services/tokens/coinmarketcap.ts:262-267`
