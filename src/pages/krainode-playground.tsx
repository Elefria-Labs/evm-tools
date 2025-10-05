import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import KrainodePlayground from '@components/tools/evmtools/KrainodePlayground';
import { Links, pageMeta } from '@config/constants';

export default function KrainodePlaygroundPage() {
  return (
    <Main
      meta={
        <Meta
          title={`JSON-RPC Playground | ${pageMeta.appName}`}
          description="Test EVM JSON-RPC calls directly from your browser."
        />
      }
      link={Links.krainodePlayground}
    >
      <ToolBase
        title="JSON-RPC Playground"
        toolComponent={<KrainodePlayground />}
      />
    </Main>
  );
}
