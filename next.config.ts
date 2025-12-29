import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '/static/img/coins/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Prevent certain modules from being bundled on client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };
    }

    // Ignore test files from thread-stream
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules[\\/]thread-stream[\\/]test/,
      use: 'null-loader',
    });

    // Add externals for problematic packages
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      'pino-pretty',
      'lokijs',
      'encoding',
    ];

    return config;
  },
};

export default nextConfig;
