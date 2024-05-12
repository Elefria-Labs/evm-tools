import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MimicWalletComponent from '@components/tools/evmtools/MimicWalletComponent';

export default function MimicWallet() {
  return (
    <Main
      meta={
        <Meta
          title="Mimic Wallet | EVM Tools"
          description="Mimic wallet connection to a dapp using WalletConnect"
        />
      }
    >
      <div className="max-w-[640px] lg:max-w-[1024px]">
        <h1 className="font-bold my-8">Mimic Wallet</h1>
        <div className="flex flex-row justify-end">
          <ConnectButton />
        </div>
        <MimicWalletComponent />
      </div>
    </Main>
  );
}
