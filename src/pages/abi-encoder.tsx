import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import ContractAbiEncoder from '@components/tools/evmtools/ContractEncoderComponent';

export default function AbiEncoder() {
  return (
    <Main
      meta={
        <Meta
          title={`Abi Encoder | ${pageMeta.appName}`}
          description="Encode smart contract functions"
        />
      }
      link={Links.contractAddressGen}
    >
      <ToolBase title="Abi Encoder" toolComponent={<ContractAbiEncoder />} />
    </Main>
  );
}
