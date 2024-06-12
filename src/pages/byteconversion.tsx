import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';

export default function ByteConversion() {
  return (
    <Main
      meta={
        <Meta
          title={`Bytes32 & String Conversion | ${pageMeta.appName}`}
          description="Convert between Bytes32 & String "
        />
      }
    >
      <ToolBase
        title="Bytes32 & String Conversion"
        toolComponent={<StringByteConversion />}
      />
    </Main>
  );
}
