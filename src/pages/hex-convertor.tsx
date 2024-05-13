import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import HexConvertorComponent from '@components/tools/evmtools/HexConvertorComponent';

export default function HexConvertor() {
  return (
    <Main
      meta={
        <Meta
          title="Hex Convertor | EVM Tools"
          description="Convert between hexadecimals, decimals and binary"
        />
      }
    >
      <ToolBase
        title="Hex Convertor"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <HexConvertorComponent />
          </div>
        }
      />
    </Main>
  );
}
