# Quick Start - Backend Testing

## 30 Second Test

```bash
npm run test:backend
```

That's it! The script will:
1. Test all three bridge providers (Across, Relay, LiFi)
2. Test the aggregation logic
3. Show detailed statistics and analytics
4. Display a pass/fail summary

## With Your Wallet

```bash
npm run test:backend 0xYourWalletAddress
```

## Test API Endpoint (Full Stack)

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run test:backend
```

## What You'll See

✅ **Success**: Green checkmarks, transaction counts, statistics
⚠️ **No Data**: Yellow warnings (wallet has no bridge activity)
❌ **Errors**: Red X marks (actual failures)

## Example Output

```
Testing Across Adapter
────────────────────────────────────────────────────────────

✓ Successfully fetched from Across
  Duration: 625ms
  Transactions found: 15
  Total Volume (USD): $5,234.56

...

Overall: 5/5 tests passed
✓ All tests passed! 🎉
```

## Understanding Results

| Result | Meaning |
|--------|---------|
| **✓ Across Adapter: 15 transactions** | Found 15 bridges via Across |
| **✓ Relay Adapter: 0 transactions** | No Relay transactions (OK!) |
| **✓ Bridge Aggregator: PASSED** | Deduplication working |
| **✗ API Endpoint: FAILED** | Dev server not running |

## Common Scenarios

### All Zeros (No Activity)
```
✓ All adapters passed
⚠ No transactions found
```
**Normal** - Wallet has no bridge activity in 2025

### Some Errors
```
Relay fetch error: Error: Relay API error: 400
✓ Successfully fetched from Relay
  Transactions found: 0
```
**OK** - Retry logic handled it, test continues

### API Test Fails
```
✗ API Endpoint: FAILED
Overall: 4/5 tests passed
```
**Expected** - Need to run dev server (`npm run dev`)

## Full Documentation

- **[README.md](README.md)** - Complete documentation
- **[USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)** - Common use cases
- **[OUTPUT_GUIDE.md](OUTPUT_GUIDE.md)** - Output interpretation

## Need Help?

1. Check if wallet address is valid Ethereum format
2. Verify wallet has bridge activity in 2025
3. Try a different wallet address
4. Check [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for troubleshooting
