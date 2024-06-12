import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import Eip712PlaygroundComponent from '@components/eip712-playground/Eip712Component';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';

export default function Eip712() {
  return (
    <Main
      meta={
        <Meta
          title={`EIP 712 Signing | ${pageMeta.appName}`}
          description="Sign typed data using EIP-712"
        />
      }
    >
      <ToolBase
        title="EIP-712 Signature"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            {/* <WalletConnectBase /> */}
            <Eip712PlaygroundComponent />
          </div>
        }
      />
    </Main>
  );
}
