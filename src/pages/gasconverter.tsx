import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import GasConvertorComponent from '@components/tools/evmtools/GasConvertorComponent';
import { Links, pageMeta } from '@config/constants';

export default function GasConvertor() {
  return (
    <Main
      meta={
        <Meta
          title={`Eth Gas Converter | ${pageMeta.appName}`}
          description="Convert between wei, gwei and eth"
        />
      }
      link={Links.gasConverter}
    >
      <ToolBase
        title="Ethereum Unit Convertor"
        toolComponent={<GasConvertorComponent />}
      />
    </Main>
  );
}
