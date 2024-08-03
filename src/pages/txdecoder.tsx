import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import { Links, pageMeta } from '@config/constants';

export default function TxDecoder() {
  return (
    <Main
      meta={
        <Meta
          title={`Transaction Decoder | ${pageMeta.appName}`}
          description="Decode raw evm transaction"
        />
      }
      link={Links.txDecoder}
    >
      <ToolBase
        title="Transaction Decoder"
        toolComponent={<TxDecoderComponent />}
      />
    </Main>
  );
}
