import React from 'react';

import { AppProps } from 'next/app';
import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

import '@firebase/firebase-config';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  baseSepolia,
  bsc,
  bscTestnet,
  polygonMumbai,
  polygonZkEvm,
  hardhat,
  anvil,
} from 'wagmi/chains';
import { ThemeProvider } from '@components/theme-provider';
import { Toaster } from '@shadcn-components/ui/toaster';
import FeedbackButton from '@components/FeedbackButton';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [metaMaskWallet, safeWallet],
//     },
//     {
//       groupName: 'Others',
//       wallets: [coinbaseWallet, walletConnectWallet],
//     },
//   ],
//   {
//     appName: 'zk-block',
//     projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
//   },
// );

const config = getDefaultConfig({
  appName: 'zk-block',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [
    // @ts-ignore
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    sepolia,
    baseSepolia,
    bsc,
    bscTestnet,
    polygonMumbai,
    polygonZkEvm,
    hardhat,
  ],
  //ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
// const fullConfig = createConfig({
//   connectors: connectors,
//   chains: [
//     mainnet,
//     polygon,
//     optimism,
//     arbitrum,
//     base,
//     zora,
//     sepolia,
//     baseSepolia,
//     bsc,
//     bscTestnet,
//     polygonMumbai,
//     polygonZkEvm,
//     hardhat,
//   ],
//   client:config.,
//   transport: http()
//   ssr: true,
// });

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    // <ChakraProvider resetCSS>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {/* @ts-ignore */}
            <Component {...pageProps} />
            <FeedbackButton />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <Toaster />
    </ThemeProvider>
  );
};
export default MyApp;
