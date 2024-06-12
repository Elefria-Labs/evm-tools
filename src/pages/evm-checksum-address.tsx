import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import EvmAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import { pageMeta } from '@config/constants';

export default function EvmChecksumAddress() {
  return (
    <Main
      meta={
        <Meta
          title={`EVM Checksum Address | ${pageMeta.appName}`}
          description="Convert address to checksum format"
        />
      }
    >
      <ToolBase
        title="EVM Checksum Address"
        toolComponent={<EvmAddressChecksumComponent />}
      />
    </Main>
  );
}
