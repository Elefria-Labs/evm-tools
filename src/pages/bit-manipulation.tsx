import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import BitMaskingComponent from '@components/tools/evmtools/BitMasking';

export default function BitManipulation() {
  return (
    <Main
      meta={
        <Meta
          title="Bit Manipulation | EVM Tools"
          description="Perform bit manipulation, apply mask for upto 256 bit integers"
        />
      }
    >
      <ToolBase
        title="Bit Manipulation"
        toolComponent={<BitMaskingComponent />}
      />
    </Main>
  );
}
