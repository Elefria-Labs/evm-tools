import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import EvmAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import { Links, pageMeta } from '@config/constants';

export default function EvmChecksumAddress() {
  return (
    <Main
      meta={
        <Meta
          title={`EVM Checksum Address | ${pageMeta.appName}`}
          description="Convert address to checksum format"
        />
      }
      link={Links.evmChecksumAddress}
    >
      <ToolBase
        title="EVM Checksum Address"
        toolComponent={<EvmAddressChecksumComponent />}
      />
    </Main>
  );
}
