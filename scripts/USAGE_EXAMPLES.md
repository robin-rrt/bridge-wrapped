# Test Script Usage Examples

## Quick Start

```bash
# Test with default address (may have no transactions)
npm run test:backend

# Test with your own wallet address
npm run test:backend 0xYourWalletAddress

# Test with a known active wallet (example)
npm run test:backend 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## Understanding the Output

### Success Case (Wallet with Transactions)

When the script finds transactions, you'll see detailed output like this:

```
Testing Across Adapter
────────────────────────────────────────────────────────────

✓ Successfully fetched from Across
  Duration: 625ms
  Transactions found: 15

  Total Volume (USD): $5,234.56
  Average Volume: $348.97
  Status Breakdown: ✓ 14 completed, ⏳ 1 pending, ✗ 0 failed
  Unique Source Chains: 2
  Unique Dest Chains: 3
  Unique Tokens: 2

  Sample Transaction:
    ID: across-0x1234abcd-1-42161
    Hash: 0x1234abcd...
    Date: 2025-03-15
    Route: Ethereum → Arbitrum
    Token: USDC
    Amount: 100.0000 USDC ($100.00)
    Status: completed

  Top Source Chains:
    • Ethereum (10 txs)
    • Base (5 txs)

  Top Destination Chains:
    • Arbitrum (8 txs)
    • Optimism (7 txs)

  Top Tokens:
    • USDC (12 txs)
    • ETH (3 txs)
```

### No Data Case

When a wallet has no bridging activity in 2025:

```
✓ Successfully fetched from Across
  Duration: 625ms
  Transactions found: 0
⚠ No transactions found for this address in the specified time range
```

This is **not an error** - it means:
- The API call succeeded
- The wallet simply has no bridge transactions in 2025
- Try a different wallet address or check a different year

### API Error Case

If the API returns an error:

```
Relay fetch error: Error: Relay API error: 400
✓ Successfully fetched from Relay
  Duration: 3925ms
  Transactions found: 0
⚠ No transactions found for this address in the specified time range
```

This can happen due to:
- Invalid wallet address format
- API rate limiting
- Temporary API issues
- The script still continues with other providers

## Test Summary Interpretation

At the end, you'll see a summary:

```
Test Summary
================================================================================

Results:

✓ Across Adapter: 15 transactions
✓ Relay Adapter: 0 transactions
✓ LiFi Adapter: 8 transactions
✓ Bridge Aggregator: PASSED
✗ API Endpoint: FAILED (server may not be running)

Overall: 4/5 tests passed
⚠ Core functionality works, but API endpoint test failed. Start the dev server to test the API.
```

### What Each Result Means:

**✓ Across Adapter: 15 transactions**
- Across API integration is working
- Found 15 bridge transactions
- Normalization logic is correct

**✓ Relay Adapter: 0 transactions**
- Relay API integration is working
- No transactions found (wallet might not have used Relay)
- This is OK, not all wallets use all bridges

**✓ Bridge Aggregator: PASSED**
- All adapters successfully combined
- Deduplication logic working
- Statistics calculated correctly

**✗ API Endpoint: FAILED**
- The Next.js server is not running
- Start it with `npm run dev` in another terminal
- Then run the test again

## Testing Different Scenarios

### Test Your Own Wallet

```bash
# Replace with your actual wallet address
npm run test:backend 0xYourActualWalletAddress
```

### Test in Different Years

To test a different year, modify the script:

1. Open `scripts/test-backend.ts`
2. Change `const TEST_YEAR = 2025;` to `const TEST_YEAR = 2024;`
3. Run the test

### Test with API Server Running

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run test:backend
```

This will test the full stack including the API endpoint.

## Common Issues

### "API Endpoint: FAILED"
**Solution**: Start the dev server (`npm run dev`) before running tests

### "All adapters return 0 transactions"
**Possible causes**:
- Wallet has no bridge activity in 2025
- Invalid wallet address format
- APIs are rate limiting requests

**Solution**: Try a different wallet address known to have activity

### "API error: 400" or "API error: 429"
**Causes**:
- 400: Invalid request (usually bad address format)
- 429: Rate limiting

**Solution**:
- Check wallet address format (must be valid Ethereum address)
- Wait a few minutes and try again
- The retry logic should handle transient errors

### "NaN%" in Provider Breakdown
**Cause**: No transactions found (division by zero)

**Solution**: This is expected when there are no transactions. Try a different wallet.

## Advanced Usage

### Running Specific Tests Only

To modify the script to run only specific adapters, edit `scripts/test-backend.ts` and comment out unwanted tests in the `runTests()` function.

### Adding Custom Wallet Addresses

You can add a list of test wallets to the script:

```typescript
const TEST_WALLETS = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0xYourWallet1',
  '0xYourWallet2',
];

// Then loop through them in runTests()
```

### Saving Test Results

Redirect output to a file:

```bash
npm run test:backend > test-results.txt 2>&1
```

Or save just the summary:

```bash
npm run test:backend 2>&1 | tail -20 > test-summary.txt
```

## Finding Active Wallets for Testing

If you need a wallet with bridge activity for testing:

1. Visit [Dune Analytics](https://dune.com) and search for "bridge analytics"
2. Look at recent bridge transactions on block explorers
3. Use addresses from bridge protocol documentation/examples
4. Check your own wallet if you've used bridges

**Note**: The default test address may not have activity in 2025 since we're currently in 2025.

## Interpreting Aggregation Results

The aggregator section shows the complete picture:

```
📊 Core Statistics
────────────────────────────────────────────────────────────
  Total Bridging Actions: 23
  Total Volume (USD): $8,456.78
  Average per Bridge: $367.69

🔍 Deduplication Analysis
────────────────────────────────────────────────────────────
  Raw transaction count: 26
  Deduplicated count: 23
  Duplicates removed: 3
  Deduplication rate: 11.54%
```

This shows:
- **Raw count (26)**: Total transactions from all providers before deduplication
- **Deduplicated count (23)**: Actual unique bridge transactions
- **Duplicates removed (3)**: Same transaction reported by multiple providers
- **Deduplication rate (11.54%)**: How much overlap exists between providers

A 10-15% deduplication rate is typical for bridges that support multiple aggregators.
