'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  optimism,
  arbitrum,
  base,
  polygon,
  bsc,
  avalanche,
  gnosis,
  fantom,
  linea,
  scroll,
  zkSync,
  blast,
  mode,
  mantle,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Bridge Wrapped',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    polygon,
    bsc,
    avalanche,
    gnosis,
    fantom,
    linea,
    scroll,
    zkSync,
    blast,
    mode,
    mantle,
  ],
  ssr: true,
});
