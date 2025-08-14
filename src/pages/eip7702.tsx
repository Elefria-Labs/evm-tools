import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import Eip7702Component from '@components/tools/evmtools/Eip7702Component';
import { Links, pageMeta } from '@config/constants';

export default function Eip7702() {
  return (
    <Main
      meta={
        <Meta
          title={`EIP-7702 Account Abstraction | ${pageMeta.appName}`}
          description="Create and verify EIP-7702 authorization signatures for account abstraction"
        />
      }
      link={Links.eip7702}
    >
      <ToolBase
        title="EIP-7702 Account Abstraction"
        toolComponent={
          <div className="max-w-[1200px]">
            <Eip7702Component />
          </div>
        }
      />
    </Main>
  );
}