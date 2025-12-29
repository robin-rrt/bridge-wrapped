# Test Script Output Guide

This guide shows what to expect from the test script output.

## Output Structure

The test output is organized into these main sections:

```
1. Test Configuration
2. Individual Adapter Tests (Across, Relay, LiFi)
3. Aggregator Test
4. API Endpoint Test
5. Test Summary
```

## Section Breakdown

### 1. Test Configuration

Shows what's being tested:

```
================================================================================
                    Bridge Wrapped Backend API Test Suite
================================================================================

Test Configuration:
  Test Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
  Test Year: 2025
  Start Timestamp: 1735689600 (2025-01-01)
  End Timestamp: 1767225599 (2025-12-31)
```

### 2. Individual Adapter Tests

Each adapter (Across, Relay, LiFi) gets its own section:

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

### 3. Aggregator Test

Shows the combined results from all providers:

```
Testing Bridge Aggregator
────────────────────────────────────────────────────────────

✓ Successfully aggregated stats
  Duration: 3624ms
  Generated at: 2025-12-15T15:15:36.123Z

📊 Core Statistics
────────────────────────────────────────────────────────────
  Total Bridging Actions: 23
  Total Volume (USD): $8,456.78
  Average per Bridge: $367.69

🔗 Most Used Source Chain
  Chain: Ethereum
  Count: 12
  Percentage: 52.17%

🎯 Most Used Destination Chain
  Chain: Arbitrum
  Count: 10
  Percentage: 43.48%

💰 Highest Volume Destination
  Chain: Arbitrum
  Volume: $5,234.56
  Count: 10

🪙 Most Bridged Token
  Token: USDC
  Count: 18
  Total Volume: $6,789.01
  Percentage: 78.26%

📅 Busiest Day
  Date: 2025-03-15
  Bridge Count: 5
  Primary Destination: Arbitrum
  Destination Count: 3

🌉 Provider Breakdown
────────────────────────────────────────────────────────────
  Across:
    Count: 15
    Volume: $5,234.56
    Percentage: 65.22%

  Relay:
    Count: 8
    Volume: $3,222.22
    Percentage: 34.78%

  LiFi:
    Count: 0
    Volume: $0.00
    Percentage: 0.00%

📈 Monthly Activity
────────────────────────────────────────────────────────────
  January: 3 bridges ($1,234.56)
  February: 5 bridges ($2,345.67)
  March: 10 bridges ($3,456.78)
  April: 5 bridges ($1,419.77)

🔝 Top Source Chains
────────────────────────────────────────────────────────────
  1. Ethereum: 12 (52.17%)
  2. Base: 8 (34.78%)
  3. Optimism: 3 (13.04%)

🎯 Top Destination Chains
────────────────────────────────────────────────────────────
  1. Arbitrum: 10 (43.48%)
  2. Optimism: 8 (34.78%)
  3. Base: 5 (21.74%)

💎 Top Tokens
────────────────────────────────────────────────────────────
  1. USDC: 18 ($6,789.01)
  2. ETH: 5 ($1,667.77)

🔍 Deduplication Analysis
────────────────────────────────────────────────────────────
  Raw transaction count: 26
  Deduplicated count: 23
  Duplicates removed: 3
  Deduplication rate: 11.54%
```

### 4. API Endpoint Test

Tests the Next.js API route (requires dev server):

```
Testing API Endpoint
────────────────────────────────────────────────────────────

✓ Successfully called API endpoint
  Duration: 156ms
  Status: 200
  Content-Type: application/json
  Response Size: 12345 bytes
  Total Bridges: 23
  Total Volume: $8,456.78
```

Or if server is not running:

```
✗ Failed to call API endpoint
  Duration: 45ms
  Error: fetch failed
⚠ Make sure the Next.js dev server is running (npm run dev)
```

### 5. Test Summary

Final summary of all tests:

```
Test Summary
================================================================================

Results:

✓ Across Adapter: 15 transactions
✓ Relay Adapter: 8 transactions
✓ LiFi Adapter: 0 transactions
✓ Bridge Aggregator: PASSED
✓ API Endpoint: PASSED

Overall: 5/5 tests passed
✓ All tests passed! 🎉
```

## Color Coding

The output uses ANSI colors for readability:

- **Cyan**: Headers and section titles
- **Yellow**: Subheaders and warnings
- **Green**: Success messages (✓)
- **Red**: Error messages (✗)
- **Dim**: Labels and metadata
- **White**: Values and data

## Different Scenarios

### Scenario 1: Active Wallet with Multiple Providers

```
Testing Across Adapter
✓ Successfully fetched from Across
  Transactions found: 15

Testing Relay Adapter
✓ Successfully fetched from Relay
  Transactions found: 8

Testing LiFi Adapter
✓ Successfully fetched from LiFi
  Transactions found: 3

Overall: 5/5 tests passed
```

### Scenario 2: Wallet Using Only One Provider

```
Testing Across Adapter
✓ Successfully fetched from Across
  Transactions found: 23

Testing Relay Adapter
✓ Successfully fetched from Relay
  Transactions found: 0
⚠ No transactions found for this address

Testing LiFi Adapter
✓ Successfully fetched from LiFi
  Transactions found: 0
⚠ No transactions found for this address

Overall: 5/5 tests passed
```

### Scenario 3: No Activity in 2025

```
Testing Across Adapter
✓ Successfully fetched from Across
  Transactions found: 0
⚠ No transactions found for this address

Testing Relay Adapter
✓ Successfully fetched from Relay
  Transactions found: 0
⚠ No transactions found for this address

Testing LiFi Adapter
✓ Successfully fetched from LiFi
  Transactions found: 0
⚠ No transactions found for this address

Testing Bridge Aggregator
✓ Successfully aggregated stats
  Total Bridging Actions: 0
  Total Volume (USD): $0.00

Overall: 5/5 tests passed
```

### Scenario 4: API Rate Limiting

```
Testing Relay Adapter

Relay fetch error: Error: Relay API error: 429
✓ Successfully fetched from Relay
  Transactions found: 0
⚠ No transactions found for this address
```

Note: The test succeeds even with rate limit errors because:
- The retry logic attempts multiple times
- Empty results are valid (wallet might not use that provider)
- Tests continue with other providers

### Scenario 5: Dev Server Not Running

```
Testing API Endpoint
✗ Failed to call API endpoint
  Duration: 45ms
  Error: fetch failed
⚠ Make sure the Next.js dev server is running (npm run dev)

Overall: 4/5 tests passed
⚠ Core functionality works, but API endpoint test failed.
```

## Understanding Statistics

### Transaction Counts

- **Transactions found**: Raw count from each provider
- **Total Bridging Actions**: Deduplicated count (actual unique bridges)
- **Duplicates removed**: Cross-provider duplicates

### Volume Calculations

- **Total Volume**: Sum of all transaction values in USD
- **Average Volume**: Total volume ÷ number of transactions
- **Per-provider Volume**: Volume attributed to each provider

### Percentages

- **Chain percentages**: (Chain count ÷ Total count) × 100
- **Token percentages**: (Token count ÷ Total count) × 100
- **Provider percentages**: (Provider count ÷ Total count) × 100
- **Deduplication rate**: (Duplicates ÷ Raw count) × 100

### Status Breakdown

- **✓ Completed**: Transaction successfully executed
- **⏳ Pending**: Transaction in progress
- **✗ Failed**: Transaction failed or refunded

## Tips for Reading Output

1. **Look at transaction counts first** - This tells you if data was found
2. **Check duration times** - Helps identify slow APIs
3. **Review status breakdown** - Most should be "completed"
4. **Examine deduplication rate** - 10-20% is typical for multi-bridge wallets
5. **Compare provider volumes** - Shows which bridges user prefers

## Saving Output

To save the full output for analysis:

```bash
# Save everything
npm run test:backend > test-results.txt 2>&1

# Save only summary
npm run test:backend 2>&1 | tail -30 > summary.txt

# Save and view simultaneously
npm run test:backend 2>&1 | tee test-results.txt
```

## Automated Testing

For CI/CD or automated testing:

```bash
# Exit code 0 on success, non-zero on failure
npm run test:backend && echo "Tests passed" || echo "Tests failed"

# Extract just pass/fail status
npm run test:backend 2>&1 | grep -E "Overall:|tests passed"
```
