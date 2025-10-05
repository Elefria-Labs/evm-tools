import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import V4PoolIdToPoolKey from '@components/tools/evmtools/V4PoolIdToPoolKey';

export default function UniswapV4PoolIdToPoolKey() {
  return (
    <Main
      meta={
        <Meta
          title={`Uniswap V4 PoolId To Pool Key | ${pageMeta.appName}`}
          description="Retrieve PoolKey from PoolId for Uniswap V4 pools"
        />
      }
      link={Links.uniswapV4PoolIdToPoolKey}
    >
      <ToolBase
        title="Uniswap V4 PoolId To Pool Key"
        toolComponent={<V4PoolIdToPoolKey />}
      />
    </Main>
  );
}
