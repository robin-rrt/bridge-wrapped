# Backend Test Script

This directory contains test scripts for the Bridge Wrapped backend services.

## test-backend.ts

A comprehensive test suite that validates all bridge provider adapters, aggregation logic, and API endpoints.

### Features

- **Individual Adapter Testing**: Tests Across, Relay, and LiFi adapters separately
- **Aggregation Testing**: Validates deduplication and statistics calculation
- **API Endpoint Testing**: Tests the Next.js API route
- **Detailed Analytics**: Shows transaction counts, volumes, chain distribution, and more
- **Beautiful Output**: Color-coded, well-formatted terminal output

### Usage

```bash
# Test with default wallet address
npm run test:backend

# Test with specific wallet address
npm run test:backend 0xYourWalletAddressHere

# Or run directly with tsx
npx tsx scripts/test-backend.ts 0xYourWalletAddressHere
```

### What It Tests

1. **Across Adapter**
   - Fetches transactions from Across API
   - Validates normalization logic
   - Shows transaction counts and volume statistics
   - Displays top chains and tokens

2. **Relay Adapter**
   - Fetches transactions from Relay API
   - Validates request normalization
   - Analyzes chain and token distribution

3. **LiFi Adapter**
   - Fetches transactions from LiFi API
   - Validates transfer normalization
   - Provides detailed analytics

4. **Bridge Aggregator**
   - Combines data from all providers
   - Tests deduplication logic
   - Calculates comprehensive statistics:
     - Total bridging actions
     - Total volume in USD
     - Most used source/destination chains
     - Highest volume destinations
     - Most bridged tokens
     - Busiest day analysis
     - Monthly activity breakdown
     - Provider breakdown

5. **API Endpoint** (requires dev server)
   - Tests `/api/bridge-stats/[address]` endpoint
   - Validates response format
   - Checks HTTP status codes

### Output Sections

The test script produces detailed output organized into sections:

#### Individual Adapter Results
- Duration and transaction count
- Volume statistics (total, average)
- Status breakdown (completed, pending, failed)
- Chain and token distribution
- Sample transaction details
- Top source/destination chains
- Top tokens bridged

#### Aggregator Results
- Core statistics (total actions, volume, averages)
- Most used source chain
- Most used destination chain
- Highest volume destination
- Most bridged token
- Busiest day analysis
- Provider breakdown (Across, Relay, LiFi)
- Monthly activity chart
- Top 5 source chains
- Top 5 destination chains
- Top tokens
- Deduplication analysis

#### API Endpoint Results
- Response time
- HTTP status code
- Response size
- Basic statistics

### Example Output

```
================================================================================
                    Bridge Wrapped Backend API Test Suite
================================================================================

Test Configuration:
  Test Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
  Test Year: 2025
  Start Timestamp: 1735689600 (2025-01-01)
  End Timestamp: 1767225599 (2025-12-31)

Testing Across Adapter
────────────────────────────────────────────────────────────

✓ Successfully fetched from Across
  Duration: 1234ms
  Transactions found: 42

  Total Volume (USD): $12,345.67
  Average Volume: $294.42
  Status Breakdown: ✓ 38 completed, ⏳ 3 pending, ✗ 1 failed
  Unique Source Chains: 3
  Unique Dest Chains: 4
  Unique Tokens: 2

  Sample Transaction:
    ID: across-0x1234...
    Hash: 0x1234abcd...
    Date: 2025-03-15
    Route: Ethereum → Arbitrum
    Token: USDC
    Amount: 100.0000 USDC ($100.00)
    Status: completed

  Top Source Chains:
    • Ethereum (25 txs)
    • Optimism (12 txs)
    • Base (5 txs)

...
```

### Requirements

- Node.js 20+
- All project dependencies installed (`npm install`)
- For API endpoint tests: Next.js dev server running (`npm run dev`)

### Configuration

The test script uses these default values (can be modified in the script):

- **Test Year**: 2025
- **Default Wallet**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- **API Base URLs**: Defined in `src/lib/constants.ts`

### Troubleshooting

**"API Endpoint: FAILED"**
- The Next.js dev server must be running (`npm run dev`) for API tests to pass
- Core functionality tests will still work without the server

**"No transactions found"**
- The wallet address may not have any bridging activity in 2025
- Try a different wallet address known to have activity

**Rate Limiting Errors**
- The script includes retry logic with exponential backoff
- If you hit rate limits, wait a few minutes and try again

### Extending the Tests

To add more test cases or modify the script:

1. Open `scripts/test-backend.ts`
2. Add new test functions following the existing patterns
3. Update the `runTests()` function to call your new tests
4. Use the provided utility functions for consistent formatting:
   - `printHeader()`, `printSubHeader()`
   - `printSuccess()`, `printError()`, `printWarning()`
   - `printInfo()`
   - `formatNumber()`, `formatUSD()`, `formatPercentage()`
