import { NextRequest, NextResponse } from 'next/server';
import { bridgeAggregator } from '@/services/bridges';
import { WRAPPED_YEAR } from '@/lib/constants';

// Validate Ethereum address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate address
    if (!address || !isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get year from query params (default to WRAPPED_YEAR)
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || WRAPPED_YEAR.toString(), 10);

    if (isNaN(year) || year < 2020 || year > 2030) {
      return NextResponse.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      );
    }

    // Fetch and aggregate stats
    const stats = await bridgeAggregator.getWrappedStats(address, year);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching bridge stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bridge statistics' },
      { status: 500 }
    );
  }
}
