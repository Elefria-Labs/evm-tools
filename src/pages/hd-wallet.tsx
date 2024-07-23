import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import HdKeyGeneratorComponent from '@components/tools/evmtools/HdKeyGeneratorComponent';
import { pageMeta } from '@config/constants';

export default function HDWallet() {
  return (
    <Main
      meta={
        <Meta
          title={`HD Wallet Generator | ${pageMeta.appName}`}
          description="Generate HD Wallets"
        />
      }
    >
      <ToolBase
        title="HD Wallet Generator"
        toolComponent={<HdKeyGeneratorComponent />}
      />
    </Main>
  );
}
