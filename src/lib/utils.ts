import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format currency (USD)
export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(2)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format large numbers compactly
export function formatCompact(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

// Format date for display
export function formatDate(date: Date | string | number): string {
  const d = new Date(typeof date === 'number' ? date * 1000 : date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format date as YYYY-MM-DD
export function formatDateISO(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toISOString().split('T')[0];
}

// Get month name from date
export function getMonthName(date: Date | string | number): string {
  const d = new Date(typeof date === 'number' ? date * 1000 : date);
  return d.toLocaleDateString('en-US', { month: 'long' });
}

// Truncate wallet address
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Parse token amount from raw value
export function parseTokenAmount(amount: string, decimals: number): number {
  try {
    // Handle empty or invalid input
    if (!amount || amount === '0') return 0;

    // Remove any whitespace
    const cleanAmount = amount.trim();

    // Parse as BigInt (handles Wei and other raw token amounts)
    const value = BigInt(cleanAmount);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;

    // Ensure fractional part is properly padded with leading zeros
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');

    // Combine and parse as float
    const result = parseFloat(`${integerPart}.${fractionalStr}`);

    // Sanity check: if result is absurdly large, log it
    if (result > 1e15) {
      console.warn('[parseTokenAmount] Suspiciously large value:', {
        amount,
        decimals,
        result
      });
    }

    return result;
  } catch (error) {
    console.error('[parseTokenAmount] Parse error:', { amount, decimals, error });
    return 0;
  }
}

// Generate unique ID from transaction data
export function generateTxId(
  provider: string,
  txHash: string,
  sourceChain: number,
  destChain: number
): string {
  return `${provider}-${txHash}-${sourceChain}-${destChain}`;
}

// Check if timestamp is within year
export function isWithinYear(
  timestamp: number,
  yearStart: number,
  yearEnd: number
): boolean {
  return timestamp >= yearStart && timestamp <= yearEnd;
}

// Sleep utility for rate limiting
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(baseDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError;
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}

// Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
