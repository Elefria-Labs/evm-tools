import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import HookMinerComponent from '@components/tools/evmtools/HooksMinerComponent';

export default function UniswapV4HooksMiner() {
  return (
    <Main
      meta={
        <Meta
          title={`Uniswap V4 Hooks Miner | ${pageMeta.appName}`}
          description="Mine salt for uniswap v4 hooks and generate a hook address"
        />
      }
      link={Links.uniswapV4HooksMiner}
    >
      <ToolBase title="V4 Hooks Miner" toolComponent={<HookMinerComponent />} />
    </Main>
  );
}
