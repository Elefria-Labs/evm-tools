import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import UniswapV4ToolComponent from '@components/tools/evmtools/UniswapV4Tools';

export default function UniswapV4Tools() {
  return (
    <Main
      meta={
        <Meta
          title="Uniswap V4 Tools | EVM Tools"
          description="Derive price from sqrtPrice or tick"
        />
      }
    >
      <ToolBase
        title="Uniswap Utils"
        toolComponent={<UniswapV4ToolComponent />}
      />
    </Main>
  );
}
