import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
  authors: [{ name: 'Bridge Wrapped' }],
  creator: 'Bridge Wrapped',
  publisher: 'Bridge Wrapped',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://bridge-wrapped.vercel.app')
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Bridge Wrapped 2025',
    title: 'Bridge Wrapped 2025 | Your Cross-Chain Journey',
    description:
      'Discover your bridging statistics across Across, Relay, and LiFi. See your most used chains, top tokens, and bridging patterns in 2025.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bridge Wrapped 2025 - Your Cross-Chain Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridge Wrapped 2025 | Your Cross-Chain Journey',
    description:
      'Discover your bridging statistics across Across, Relay, and LiFi. See your most used chains, top tokens, and bridging patterns in 2025.',
    images: ['/og-image.png'],
    creator: '@bridgewrapped',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
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
        <SpeedInsights />
      </body>
    </html>
  );
}
