import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import NetworkListComponent from '@components/tools/evmtools/NetworkListComponent';

export default function NetworkList() {
  return (
    <Main
      meta={
        <Meta
          title={`Network List | ${pageMeta.appName}`}
          description="Discover and connect to EVM-compatible networks with MetaMask integration"
        />
      }
      link={Links.networkList}
    >
      <ToolBase
        title="Network List"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <NetworkListComponent />
          </div>
        }
      />
    </Main>
  );
}
