import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import UniswapV4ToolComponent from '@components/tools/evmtools/UniswapV4Tools';
import { Links, pageMeta } from '@config/constants';

export default function UniswapV4Tools() {
  return (
    <Main
      meta={
        <Meta
          title={`Uniswap V4 Price Tools | ${pageMeta.appName}`}
          description="Derive price from sqrtPrice or tick"
        />
      }
      link={Links.uniswapV4Tools}
    >
      <ToolBase
        title="Uniswap Price Utils"
        toolComponent={<UniswapV4ToolComponent />}
      />
    </Main>
  );
}
