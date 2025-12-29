import { NextRequest, NextResponse } from 'next/server';

interface CoinMarketCapTokenInfo {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  logo: string;
  description: string;
  date_added: string;
  date_launched: string | null;
  tags: string[];
  platform?: {
    name: string;
    token_address: string;
  } | null;
  category: string;
  urls?: {
    website?: string[];
    technical_doc?: string[];
    twitter?: string[];
    explorer?: string[];
    source_code?: string[];
  };
}

interface CoinMarketCapResponse {
  data: {
    [key: string]: CoinMarketCapTokenInfo;
  };
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Invalid request: addresses must be an array' },
        { status: 400 }
      );
    }

    const apiKey = process.env.COINMARKETCAP_API_KEY;

    if (!apiKey) {
      console.warn('CoinMarketCap API key not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${addresses.join(',')}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinMarketCap API error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { error: 'CoinMarketCap API request failed' },
        { status: response.status }
      );
    }

    const data: CoinMarketCapResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in token-info API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
