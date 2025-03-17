import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import ENSResolverTool from '@components/tools/evmtools/EnsToolsComponent';

export default function EnsLookup() {
  return (
    <Main
      meta={
        <Meta
          title={`ENS Lookup | ${pageMeta.appName}`}
          description="Lookup and reverse lookup ens names"
        />
      }
      link={Links.ensLookup}
    >
      <ToolBase title="ENS Lookup" toolComponent={<ENSResolverTool />} />
    </Main>
  );
}
