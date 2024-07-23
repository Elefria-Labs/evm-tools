import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import HexConverterComponent from '@components/tools/evmtools/HexConverterComponent';
import { Links, pageMeta } from '@config/constants';

export default function HexConverter() {
  return (
    <Main
      meta={
        <Meta
          title={`Hex Converter | ${pageMeta.appName}`}
          description="Convert between hexadecimals, decimals and binary"
        />
      }
      link={Links.hexConverter}
    >
      <ToolBase
        title="Hex Converter"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <HexConverterComponent />
          </div>
        }
      />
    </Main>
  );
}
