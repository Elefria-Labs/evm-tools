import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import ContractGenerator from '@components/tools/evmtools/HooksTemplateGeneratorComponent';

export default function UniswapV4HooksChecker() {
  return (
    <Main
      meta={
        <Meta
          title={`Uniswap V4 Hooks Template Generator | ${pageMeta.appName}`}
          description="Generate Uniswap v4 hook contract template based on selected hooks"
        />
      }
      link={Links.uniswapV4HooksTemplateGenerator}
    >
      <ToolBase
        title="V4 Hooks Template Generator"
        toolComponent={<ContractGenerator />}
      />
    </Main>
  );
}
