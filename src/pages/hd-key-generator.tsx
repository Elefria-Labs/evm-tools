import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';
import HdKeyGeneratorComponent from '@components/tools/evmtools/HdKeyGeneratorComponent';

export default function HdKeyGenerator() {
  return (
    <Main
      meta={
        <Meta
          title={`HD Key Generator | ${pageMeta.appName}`}
          description="Derive keys using mnemonic phrase and BIP44 derivation"
        />
      }
    >
      <ToolBase
        title="HD Key Generator"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <HdKeyGeneratorComponent />
          </div>
        }
      />
    </Main>
  );
}
