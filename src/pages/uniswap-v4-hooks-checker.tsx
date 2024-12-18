import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import UniswapV4HooksCheckerComponent from '@components/tools/evmtools/UniswapV4HooksCheckerComponent';

export default function UniswapV4HooksChecker() {
  return (
    <Main
      meta={
        <Meta
          title={`Uniswap V4 Hooks Checker | ${pageMeta.appName}`}
          description="Check which Uniswap V4 hooks are enabled from the hook address"
        />
      }
      link={Links.uniswapV4HooksChecker}
    >
      <ToolBase
        title="Uniswap V4 Hooks Checker"
        toolComponent={<UniswapV4HooksCheckerComponent />}
      />
    </Main>
  );
}
