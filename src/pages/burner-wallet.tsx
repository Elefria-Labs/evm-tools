import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';
import { pageMeta } from '@config/constants';

export default function BurnerWallet() {
  return (
    <Main
      meta={
        <Meta
          title={`Burner Wallet | ${pageMeta.appName}`}
          description="Generate random private keys for evm chains"
        />
      }
    >
      <ToolBase
        title="Burner Wallet"
        toolComponent={<BurnerWalletComponent />}
      />
    </Main>
  );
}
