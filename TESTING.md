# Testing Bridge Wrapped Backend

This document describes how to test the Bridge Wrapped backend services.

## Quick Start

```bash
# Run the comprehensive backend test
npm run test:backend

# Test with a specific wallet address
npm run test:backend 0xYourWalletAddress
```

## What Gets Tested

The test script validates the entire backend stack:

### 1. Individual Bridge Adapters
- **Across Adapter**: Tests integration with Across Protocol API
- **Relay Adapter**: Tests integration with Relay Protocol API
- **LiFi Adapter**: Tests integration with LiFi Protocol API

Each adapter test shows:
- API response time
- Number of transactions found
- Volume statistics (total, average)
- Transaction status breakdown
- Chain and token distribution
- Sample transaction details

### 2. Bridge Aggregator
Tests the core aggregation logic that:
- Fetches from all providers in parallel
- Deduplicates transactions across providers
- Calculates comprehensive statistics
- Generates the final "wrapped" stats object

### 3. API Endpoint (requires dev server)
Tests the Next.js API route at `/api/bridge-stats/[address]`

## Test Output

The script produces color-coded, well-formatted output showing:

```
📊 Core Statistics
🔗 Most Used Source Chain
🎯 Most Used Destination Chain
💰 Highest Volume Destination
🪙 Most Bridged Token
📅 Busiest Day
🌉 Provider Breakdown
📈 Monthly Activity
🔝 Top Chains & Tokens
🔍 Deduplication Analysis
```

## Documentation

Detailed documentation available in `scripts/`:

- **[README.md](scripts/README.md)** - Full test script documentation
- **[USAGE_EXAMPLES.md](scripts/USAGE_EXAMPLES.md)** - Common usage patterns and troubleshooting

## Requirements

- Node.js 20+
- Dependencies installed: `npm install`
- Optional: Next.js dev server for API tests (`npm run dev`)

## Expected Results

### With Active Wallet
If the wallet has bridge transactions in 2025, you'll see:
- ✓ All adapters pass with transaction counts
- ✓ Aggregator calculates full statistics
- Detailed analytics for each provider

### With Inactive Wallet
If the wallet has no activity:
- ✓ All adapters pass but return 0 transactions
- ⚠ Warning: "No transactions found"
- This is normal, not an error

### Without Dev Server
- ✓ All adapter and aggregator tests pass
- ✗ API endpoint test fails
- Overall: 4/5 tests pass (this is OK)

## Interpreting Results

### Success Indicators
- ✓ Green checkmarks indicate passing tests
- Transaction counts and volumes displayed
- Deduplication working (removing cross-provider duplicates)

### Warning Signs
- ⚠ Yellow warnings indicate no data found (not necessarily errors)
- API errors from rate limiting (retry logic handles this)

### Failures
- ✗ Red X marks indicate actual failures
- Review error messages and stack traces
- Common cause: Dev server not running for API tests

## Customization

Edit `scripts/test-backend.ts` to:
- Change the test year (default: 2025)
- Modify the default wallet address
- Add custom analytics
- Adjust output formatting

## CI/CD Integration

To integrate with CI/CD pipelines:

```bash
# Run tests without API endpoint (no server needed)
npm run test:backend 2>&1 | grep -E "(✓|✗|passed)"
```

The script exits with code 0 on success, non-zero on failure.

## Example Output

```
================================================================================
                    Bridge Wrapped Backend API Test Suite
================================================================================

Testing Across Adapter
────────────────────────────────────────────────────────────

✓ Successfully fetched from Across
  Duration: 625ms
  Transactions found: 15

  Total Volume (USD): $5,234.56
  Average Volume: $348.97
  Status Breakdown: ✓ 14 completed, ⏳ 1 pending, ✗ 0 failed
  ...

Testing Bridge Aggregator
────────────────────────────────────────────────────────────

✓ Successfully aggregated stats

📊 Core Statistics
────────────────────────────────────────────────────────────
  Total Bridging Actions: 23
  Total Volume (USD): $8,456.78
  Average per Bridge: $367.69
  ...

Test Summary
================================================================================

✓ Across Adapter: 15 transactions
✓ Relay Adapter: 8 transactions
✓ LiFi Adapter: 0 transactions
✓ Bridge Aggregator: PASSED
✓ API Endpoint: PASSED

Overall: 5/5 tests passed
✓ All tests passed! 🎉
```

## Support

For issues or questions:
1. Check [scripts/USAGE_EXAMPLES.md](scripts/USAGE_EXAMPLES.md) for common scenarios
2. Review error messages and stack traces
3. Ensure all dependencies are installed
4. Verify wallet address format
5. Check API rate limits aren't being hit
