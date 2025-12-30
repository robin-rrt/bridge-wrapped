import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bridge Wrapped 2025 | Your Cross-Chain Journey',
  description:
    'Discover your bridging statistics across Across, Relay, and LiFi. See your most used chains, top tokens, and bridging patterns in 2025.',
  keywords: [
    'bridge wrapped',
    'cross-chain',
    'DeFi',
    'Across',
    'Relay',
    'LiFi',
    'blockchain',
    'crypto',
    'web3',
  ],
  openGraph: {
    title: 'Bridge Wrapped 2025',
    description: 'Discover your cross-chain bridging journey in 2025',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
