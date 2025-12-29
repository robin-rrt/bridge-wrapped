#!/usr/bin/env tsx
/**
 * Bridge Wrapped Backend API Test Script
 *
 * Tests all bridge provider adapters, aggregation logic, and API endpoints
 * Usage: npx tsx scripts/test-backend.ts [wallet_address]
 */

import { acrossAdapter } from '../src/services/bridges/across';
import { relayAdapter } from '../src/services/bridges/relay';
import { lifiAdapter } from '../src/services/bridges/lifi';
import { bridgeAggregator } from '../src/services/bridges/aggregator';
import type { NormalizedBridgeTransaction, BridgeWrappedStats } from '../src/types';

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Test configuration
const TEST_YEAR = 2025;
const TEST_ADDRESS = process.argv[2] || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Time range for tests
const START_TIMESTAMP = Math.floor(new Date(`${TEST_YEAR}-01-01T00:00:00Z`).getTime() / 1000);
const END_TIMESTAMP = Math.floor(new Date(`${TEST_YEAR}-12-31T23:59:59Z`).getTime() / 1000);

// Utility functions
function printHeader(text: string) {
  const line = '='.repeat(80);
  console.log(`\n${colors.bright}${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${line}${colors.reset}\n`);
}

function printSubHeader(text: string) {
  console.log(`${colors.bright}${colors.yellow}${text}${colors.reset}`);
  console.log(`${colors.yellow}${'─'.repeat(60)}${colors.reset}\n`);
}

function printSuccess(text: string) {
  console.log(`${colors.green}✓${colors.reset} ${text}`);
}

function printError(text: string) {
  console.log(`${colors.red}✗${colors.reset} ${text}`);
}

function printWarning(text: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${text}`);
}

function printInfo(label: string, value: any) {
  console.log(`  ${colors.dim}${label}:${colors.reset} ${colors.white}${value}${colors.reset}`);
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercentage(num: number): string {
  return `${num.toFixed(2)}%`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}

// Test individual adapter
async function testAdapter(
  name: string,
  adapter: typeof acrossAdapter | typeof relayAdapter | typeof lifiAdapter
) {
  printSubHeader(`Testing ${name} Adapter`);

  const startTime = Date.now();
  let transactions: NormalizedBridgeTransaction[] = [];
  let error: Error | null = null;

  try {
    transactions = await adapter.fetchTransactions(
      TEST_ADDRESS,
      START_TIMESTAMP,
      END_TIMESTAMP
    );
    const duration = Date.now() - startTime;

    printSuccess(`Successfully fetched from ${name}`);
    printInfo('Duration', `${duration}ms`);
    printInfo('Transactions found', formatNumber(transactions.length));

    if (transactions.length > 0) {
      // Analyze transactions
      const totalVolume = transactions.reduce((sum, tx) => sum + tx.amountUSD, 0);
      const avgVolume = totalVolume / transactions.length;
      const completed = transactions.filter(tx => tx.status === 'completed').length;
      const pending = transactions.filter(tx => tx.status === 'pending').length;
      const failed = transactions.filter(tx => tx.status === 'failed').length;

      // Chain analysis
      const sourceChains = new Map<number, number>();
      const destChains = new Map<number, number>();
      const tokens = new Map<string, number>();

      transactions.forEach(tx => {
        sourceChains.set(tx.sourceChainId, (sourceChains.get(tx.sourceChainId) || 0) + 1);
        destChains.set(tx.destinationChainId, (destChains.get(tx.destinationChainId) || 0) + 1);
        tokens.set(tx.tokenSymbol, (tokens.get(tx.tokenSymbol) || 0) + 1);
      });

      console.log();
      printInfo('Total Volume (USD)', formatUSD(totalVolume));
      printInfo('Average Volume', formatUSD(avgVolume));
      printInfo('Status Breakdown', `✓ ${completed} completed, ⏳ ${pending} pending, ✗ ${failed} failed`);
      printInfo('Unique Source Chains', sourceChains.size);
      printInfo('Unique Dest Chains', destChains.size);
      printInfo('Unique Tokens', tokens.size);

      // Show sample transaction
      console.log(`\n  ${colors.dim}Sample Transaction:${colors.reset}`);
      const sample = transactions[0];
      console.log(`    ${colors.dim}ID:${colors.reset} ${sample.id}`);
      console.log(`    ${colors.dim}Hash:${colors.reset} ${sample.txHash.slice(0, 10)}...`);
      console.log(`    ${colors.dim}Date:${colors.reset} ${formatDate(sample.timestamp)}`);
      console.log(`    ${colors.dim}Route:${colors.reset} ${sample.sourceChainName} → ${sample.destinationChainName}`);
      console.log(`    ${colors.dim}Token:${colors.reset} ${sample.tokenSymbol}`);
      console.log(`    ${colors.dim}Amount:${colors.reset} ${sample.amountFormatted.toFixed(4)} ${sample.tokenSymbol} (${formatUSD(sample.amountUSD)})`);
      console.log(`    ${colors.dim}Status:${colors.reset} ${sample.status}`);

      // Show top chains
      const topSourceChains = Array.from(sourceChains.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      const topDestChains = Array.from(destChains.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      console.log(`\n  ${colors.dim}Top Source Chains:${colors.reset}`);
      topSourceChains.forEach(([chainId, count]) => {
        const tx = transactions.find(t => t.sourceChainId === chainId);
        console.log(`    • ${tx?.sourceChainName || chainId} (${count} txs)`);
      });

      console.log(`\n  ${colors.dim}Top Destination Chains:${colors.reset}`);
      topDestChains.forEach(([chainId, count]) => {
        const tx = transactions.find(t => t.destinationChainId === chainId);
        console.log(`    • ${tx?.destinationChainName || chainId} (${count} txs)`);
      });

      // Show top tokens
      const topTokens = Array.from(tokens.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      console.log(`\n  ${colors.dim}Top Tokens:${colors.reset}`);
      topTokens.forEach(([symbol, count]) => {
        console.log(`    • ${symbol} (${count} txs)`);
      });

    } else {
      printWarning('No transactions found for this address in the specified time range');
    }

  } catch (err) {
    error = err as Error;
    const duration = Date.now() - startTime;
    printError(`Failed to fetch from ${name}`);
    printInfo('Duration', `${duration}ms`);
    printInfo('Error', error.message);
  }

  console.log();
  return { transactions, error };
}

// Test aggregator
async function testAggregator() {
  printSubHeader('Testing Bridge Aggregator');

  const startTime = Date.now();
  let stats: BridgeWrappedStats | null = null;
  let error: Error | null = null;

  try {
    stats = await bridgeAggregator.getWrappedStats(TEST_ADDRESS, TEST_YEAR);
    const duration = Date.now() - startTime;

    printSuccess('Successfully aggregated stats');
    printInfo('Duration', `${duration}ms`);
    printInfo('Generated at', stats.generatedAt);

    console.log();
    console.log(`${colors.bright}📊 Core Statistics${colors.reset}`);
    console.log(`${'─'.repeat(60)}`);
    printInfo('Total Bridging Actions', formatNumber(stats.totalBridgingActions));
    printInfo('Total Volume (USD)', formatUSD(stats.totalVolumeUSD));
    printInfo('Average per Bridge', formatUSD(stats.totalVolumeUSD / stats.totalBridgingActions));

    if (stats.mostUsedSourceChain) {
      console.log();
      console.log(`${colors.bright}🔗 Most Used Source Chain${colors.reset}`);
      printInfo('Chain', stats.mostUsedSourceChain.chainName);
      printInfo('Count', formatNumber(stats.mostUsedSourceChain.count));
      printInfo('Percentage', formatPercentage(stats.mostUsedSourceChain.percentage));
    }

    if (stats.mostUsedDestinationChain) {
      console.log();
      console.log(`${colors.bright}🎯 Most Used Destination Chain${colors.reset}`);
      printInfo('Chain', stats.mostUsedDestinationChain.chainName);
      printInfo('Count', formatNumber(stats.mostUsedDestinationChain.count));
      printInfo('Percentage', formatPercentage(stats.mostUsedDestinationChain.percentage));
    }

    if (stats.highestVolumeDestination) {
      console.log();
      console.log(`${colors.bright}💰 Highest Volume Destination${colors.reset}`);
      printInfo('Chain', stats.highestVolumeDestination.chainName);
      printInfo('Volume', formatUSD(stats.highestVolumeDestination.volumeUSD));
      printInfo('Count', formatNumber(stats.highestVolumeDestination.count));
    }

    if (stats.mostBridgedToken) {
      console.log();
      console.log(`${colors.bright}🪙 Most Bridged Token${colors.reset}`);
      printInfo('Token', stats.mostBridgedToken.symbol);
      printInfo('Count', formatNumber(stats.mostBridgedToken.count));
      printInfo('Total Volume', formatUSD(stats.mostBridgedToken.totalVolumeUSD));
      printInfo('Percentage', formatPercentage(stats.mostBridgedToken.percentage));
    }

    if (stats.busiestDay) {
      console.log();
      console.log(`${colors.bright}📅 Busiest Day${colors.reset}`);
      printInfo('Date', stats.busiestDay.date);
      printInfo('Bridge Count', formatNumber(stats.busiestDay.count));
      printInfo('Primary Destination', stats.busiestDay.primaryDestination.chainName);
      printInfo('Destination Count', formatNumber(stats.busiestDay.primaryDestination.count));
    }

    console.log();
    console.log(`${colors.bright}🌉 Provider Breakdown${colors.reset}`);
    console.log(`${'─'.repeat(60)}`);
    const totalCount = stats.providerBreakdown.across.count +
                       stats.providerBreakdown.relay.count +
                       stats.providerBreakdown.lifi.count;

    console.log(`  ${colors.magenta}Across:${colors.reset}`);
    printInfo('  Count', formatNumber(stats.providerBreakdown.across.count));
    printInfo('  Volume', formatUSD(stats.providerBreakdown.across.volumeUSD));
    printInfo('  Percentage', formatPercentage((stats.providerBreakdown.across.count / totalCount) * 100));

    console.log(`\n  ${colors.magenta}Relay:${colors.reset}`);
    printInfo('  Count', formatNumber(stats.providerBreakdown.relay.count));
    printInfo('  Volume', formatUSD(stats.providerBreakdown.relay.volumeUSD));
    printInfo('  Percentage', formatPercentage((stats.providerBreakdown.relay.count / totalCount) * 100));

    console.log(`\n  ${colors.magenta}LiFi:${colors.reset}`);
    printInfo('  Count', formatNumber(stats.providerBreakdown.lifi.count));
    printInfo('  Volume', formatUSD(stats.providerBreakdown.lifi.volumeUSD));
    printInfo('  Percentage', formatPercentage((stats.providerBreakdown.lifi.count / totalCount) * 100));

    // Monthly activity
    console.log();
    console.log(`${colors.bright}📈 Monthly Activity${colors.reset}`);
    console.log(`${'─'.repeat(60)}`);
    const activeMonths = stats.monthlyActivity.filter(m => m.count > 0);
    if (activeMonths.length > 0) {
      activeMonths.forEach(month => {
        console.log(`  ${colors.cyan}${month.monthName}:${colors.reset} ${formatNumber(month.count)} bridges (${formatUSD(month.volumeUSD)})`);
      });
    } else {
      printWarning('No active months found');
    }

    // Top chains
    if (stats.topSourceChains.length > 0) {
      console.log();
      console.log(`${colors.bright}🔝 Top Source Chains${colors.reset}`);
      console.log(`${'─'.repeat(60)}`);
      stats.topSourceChains.forEach((chain, i) => {
        console.log(`  ${i + 1}. ${chain.chainName}: ${formatNumber(chain.count)} (${formatPercentage(chain.percentage)})`);
      });
    }

    if (stats.topDestinationChains.length > 0) {
      console.log();
      console.log(`${colors.bright}🎯 Top Destination Chains${colors.reset}`);
      console.log(`${'─'.repeat(60)}`);
      stats.topDestinationChains.forEach((chain, i) => {
        console.log(`  ${i + 1}. ${chain.chainName}: ${formatNumber(chain.count)} (${formatPercentage(chain.percentage)})`);
      });
    }

    if (stats.topTokens.length > 0) {
      console.log();
      console.log(`${colors.bright}💎 Top Tokens${colors.reset}`);
      console.log(`${'─'.repeat(60)}`);
      stats.topTokens.forEach((token, i) => {
        console.log(`  ${i + 1}. ${token.symbol}: ${formatNumber(token.count)} (${formatUSD(token.totalVolumeUSD)})`);
      });
    }

    // Deduplication analysis
    console.log();
    console.log(`${colors.bright}🔍 Deduplication Analysis${colors.reset}`);
    console.log(`${'─'.repeat(60)}`);
    const rawTotal = stats.providerBreakdown.across.count +
                     stats.providerBreakdown.relay.count +
                     stats.providerBreakdown.lifi.count;
    const dedupedTotal = stats.totalBridgingActions;
    const duplicates = rawTotal - dedupedTotal;
    printInfo('Raw transaction count', formatNumber(rawTotal));
    printInfo('Deduplicated count', formatNumber(dedupedTotal));
    printInfo('Duplicates removed', formatNumber(duplicates));
    if (rawTotal > 0) {
      printInfo('Deduplication rate', formatPercentage((duplicates / rawTotal) * 100));
    }

  } catch (err) {
    error = err as Error;
    const duration = Date.now() - startTime;
    printError('Failed to aggregate stats');
    printInfo('Duration', `${duration}ms`);
    printInfo('Error', error.message);
    console.error(error);
  }

  console.log();
  return { stats, error };
}

// Test API endpoint
async function testAPIEndpoint() {
  printSubHeader('Testing API Endpoint');

  const startTime = Date.now();
  let stats: BridgeWrappedStats | null = null;
  let error: Error | null = null;

  try {
    const response = await fetch(
      `http://localhost:3000/api/bridge-stats/${TEST_ADDRESS}?year=${TEST_YEAR}`
    );

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    stats = await response.json();

    printSuccess('Successfully called API endpoint');
    printInfo('Duration', `${duration}ms`);
    printInfo('Status', response.status);
    printInfo('Content-Type', response.headers.get('content-type') || 'unknown');
    printInfo('Response Size', `${JSON.stringify(stats).length} bytes`);
    if (stats) {
      printInfo('Total Bridges', formatNumber(stats.totalBridgingActions));
      printInfo('Total Volume', formatUSD(stats.totalVolumeUSD));
    }

  } catch (err) {
    error = err as Error;
    const duration = Date.now() - startTime;
    printError('Failed to call API endpoint');
    printInfo('Duration', `${duration}ms`);
    printInfo('Error', error.message);
    printWarning('Make sure the Next.js dev server is running (npm run dev)');
  }

  console.log();
  return { stats, error };
}

// Main test runner
async function runTests() {
  printHeader('Bridge Wrapped Backend API Test Suite');

  console.log(`${colors.dim}Test Configuration:${colors.reset}`);
  printInfo('Test Address', TEST_ADDRESS);
  printInfo('Test Year', TEST_YEAR);
  printInfo('Start Timestamp', `${START_TIMESTAMP} (${formatDate(START_TIMESTAMP)})`);
  printInfo('End Timestamp', `${END_TIMESTAMP} (${formatDate(END_TIMESTAMP)})`);
  console.log();

  const results = {
    across: { success: false, transactions: 0 },
    relay: { success: false, transactions: 0 },
    lifi: { success: false, transactions: 0 },
    aggregator: { success: false },
    api: { success: false },
  };

  // Test individual adapters
  const acrossResult = await testAdapter('Across', acrossAdapter);
  results.across.success = !acrossResult.error;
  results.across.transactions = acrossResult.transactions.length;

  const relayResult = await testAdapter('Relay', relayAdapter);
  results.relay.success = !relayResult.error;
  results.relay.transactions = relayResult.transactions.length;

  const lifiResult = await testAdapter('LiFi', lifiAdapter);
  results.lifi.success = !lifiResult.error;
  results.lifi.transactions = lifiResult.transactions.length;

  // Test aggregator
  const aggregatorResult = await testAggregator();
  results.aggregator.success = !aggregatorResult.error;

  // Test API endpoint
  const apiResult = await testAPIEndpoint();
  results.api.success = !apiResult.error;

  // Summary
  printHeader('Test Summary');

  const totalTests = 5;
  const passedTests = Object.values(results).filter(r => r.success).length;

  console.log(`${colors.bright}Results:${colors.reset}`);
  console.log();

  if (results.across.success) {
    printSuccess(`Across Adapter: ${formatNumber(results.across.transactions)} transactions`);
  } else {
    printError('Across Adapter: FAILED');
  }

  if (results.relay.success) {
    printSuccess(`Relay Adapter: ${formatNumber(results.relay.transactions)} transactions`);
  } else {
    printError('Relay Adapter: FAILED');
  }

  if (results.lifi.success) {
    printSuccess(`LiFi Adapter: ${formatNumber(results.lifi.transactions)} transactions`);
  } else {
    printError('LiFi Adapter: FAILED');
  }

  if (results.aggregator.success) {
    printSuccess('Bridge Aggregator: PASSED');
  } else {
    printError('Bridge Aggregator: FAILED');
  }

  if (results.api.success) {
    printSuccess('API Endpoint: PASSED');
  } else {
    printError('API Endpoint: FAILED (server may not be running)');
  }

  console.log();
  console.log(`${colors.bright}Overall: ${passedTests}/${totalTests} tests passed${colors.reset}`);

  if (passedTests === totalTests) {
    printSuccess('All tests passed! 🎉');
  } else if (passedTests >= totalTests - 1 && !results.api.success) {
    printWarning('Core functionality works, but API endpoint test failed. Start the dev server to test the API.');
  } else {
    printError('Some tests failed. Please review the errors above.');
  }

  console.log();
}

// Run the tests
runTests().catch(error => {
  printError('Fatal error running tests');
  console.error(error);
  process.exit(1);
});
