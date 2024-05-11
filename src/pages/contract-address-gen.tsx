import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import DeterministicAddress from '@components/tools/evmtools/DeterministicAddress';
import ToolBase from '@components/common/ToolBase';
import WalletConnectBase from '@components/common/WalletConnectBase';

export default function ContractAddressGen() {
  return (
    <Main
      meta={
        <Meta
          title="Deterministic Contract Address | Zk block"
          description="Generate the next deployment contract address from an account"
        />
      }
    >
      <ToolBase
        title="Deterministic Contract Address"
        toolComponent={
          <>
            <WalletConnectBase />

            <DeterministicAddress />
          </>
        }
      />
    </Main>
  );
}
