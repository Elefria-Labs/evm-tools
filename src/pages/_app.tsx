import React from 'react';

import { AppProps } from 'next/app';
import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@firebase/firebase-config';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from '@components/theme-provider';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [
      publicProvider(),
      // alchemyProvider({ apiKey: process.env.ALCHEMY_ID! }),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: 'zk-block',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  return (
    // <ChakraProvider resetCSS>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
};
export default MyApp;
