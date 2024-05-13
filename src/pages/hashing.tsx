import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import HashingComponent from '@components/tools/evmtools/HashingComponent';

export default function Hashing() {
  return (
    <Main
      meta={
        <Meta
          title="Hashing Utils | EVM Tools"
          description="Derive keccack256, Sha256 hashes"
        />
      }
    >
      <ToolBase
        title="Hashing Utils"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <HashingComponent />
          </div>
        }
      />
    </Main>
  );
}
