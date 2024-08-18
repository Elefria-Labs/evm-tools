import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';
import BaseContractUiComponent from '@components/tools/evmtools/BaseContractUiComponent';

export default function ContractsUi() {
  return (
    <Main
      meta={
        <Meta
          title={`Contracts UI | ${pageMeta.appName}`}
          description="Interact with multiple contracts at the same time. Call read and write functions."
        />
      }
    >
      <ToolBase
        title="Contracts UI"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <BaseContractUiComponent />
          </div>
        }
      />
    </Main>
  );
}
