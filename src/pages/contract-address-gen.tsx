import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import DeterministicAddress from '@components/tools/evmtools/DeterministicAddress';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';

export default function ContractAddressGen() {
  return (
    <Main
      meta={
        <Meta
          title={`Deterministic Contract Address | ${pageMeta.appName}`}
          description="Generate the next deployment contract address from an account"
        />
      }
      link={Links.contractAddressGen}
    >
      <ToolBase
        title="Deterministic Contract Address"
        toolComponent={<DeterministicAddress />}
      />
    </Main>
  );
}
