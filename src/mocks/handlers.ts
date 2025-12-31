import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock the internal /api/token-info endpoint that the service calls
  // Using http://localhost:3000 to match Node.js test environment
  http.post('http://localhost:3000/api/token-info', async ({ request }) => {
    const body = (await request.json()) as { addresses: string[] };
    const addresses = body.addresses || [];

    // Mock response for LINK token
    const linkAddress = '0x514910771af9ca656af840dff83e8264ecf986ca';
    if (addresses.some((addr: string) => addr.toLowerCase() === linkAddress)) {
      return HttpResponse.json({
        status: {
          error_code: 0,
          error_message: null,
          timestamp: new Date().toISOString(),
          elapsed: 10,
          credit_count: 1,
          notice: null,
        },
        data: {
          '1975': {
            id: 1975,
            name: 'Chainlink',
            symbol: 'LINK',
            slug: 'chainlink',
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
            description: 'Chainlink (LINK) is a decentralized oracle network...',
            date_added: '2017-09-20T00:00:00.000Z',
            date_launched: null,
            tags: ['oracle', 'defi'],
            platform: {
              name: 'Ethereum',
              token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            },
            category: 'token',
          },
        },
      });
    }

    // 400 for unknown tokens
    return HttpResponse.json(
      {
        status: {
          error_code: 400,
          error_message: 'Invalid value for address',
          timestamp: new Date().toISOString(),
          elapsed: 10,
          credit_count: 0,
          notice: null,
        },
        data: {},
      },
      { status: 400 }
    );
  }),

  // Mock the external CoinMarketCap API (for direct API testing)
  http.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info', ({ request }) => {
    const url = new URL(request.url);
    const address = url.searchParams.get('address');

    // Mock response for LINK token
    if (address?.toLowerCase() === '0x514910771af9ca656af840dff83e8264ecf986ca') {
      return HttpResponse.json({
        status: {
          error_code: 0,
          error_message: null,
          timestamp: new Date().toISOString(),
          elapsed: 10,
          credit_count: 1,
          notice: null,
        },
        data: {
          '1975': {
            id: 1975,
            name: 'Chainlink',
            symbol: 'LINK',
            slug: 'chainlink',
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
            description: 'Chainlink (LINK) is a decentralized oracle network...',
            date_added: '2017-09-20T00:00:00.000Z',
            date_launched: null,
            tags: ['oracle', 'defi'],
            platform: {
              name: 'Ethereum',
              token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            },
            category: 'token',
          },
        },
      });
    }

    // 400 for unknown tokens
    return HttpResponse.json(
      {
        status: {
          error_code: 400,
          error_message: 'Invalid value for address',
          timestamp: new Date().toISOString(),
          elapsed: 10,
          credit_count: 0,
          notice: null,
        },
        data: {},
      },
      { status: 400 }
    );
  }),
];
