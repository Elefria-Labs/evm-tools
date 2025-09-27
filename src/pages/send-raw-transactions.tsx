import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import RawTransactionSubmitter from '@components/tools/evmtools/RawTransactionSubmitter';

export default function SendRawTransactions() {
  return (
    <Main
      meta={
        <Meta
          title={`Send Raw Transactions | ${pageMeta.appName}`}
          description="SImulate and send raw transactions"
        />
      }
      link={Links.sendRawTransaction}
    >
      <ToolBase
        title="Send Raw Transactions"
        toolComponent={<RawTransactionSubmitter />}
      />
    </Main>
  );
}
