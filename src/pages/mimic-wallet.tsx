import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import MimicWalletComponent from '@components/tools/evmtools/MimicWalletComponent';
import ToolBase from '@components/common/ToolBase';
import WalletConnectBase from '@components/common/WalletConnectBase';
import { pageMeta } from '@config/constants';

export default function MimicWallet() {
  return (
    <Main
      meta={
        <Meta
          title={`Mimic Wallet | ${pageMeta.appName}`}
          description="Mimic wallet connection to a dapp using WalletConnect"
        />
      }
    >
      <ToolBase
        title="Mimic Wallet"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <WalletConnectBase />
            <MimicWalletComponent />
          </div>
        }
      />
    </Main>
  );
}
