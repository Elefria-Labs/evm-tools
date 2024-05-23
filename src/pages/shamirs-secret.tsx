import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import ShamirSecretSharingComponent from '@components/tools/evmtools/ShamirSecretSharingComponent';

export default function TxDecoder() {
  return (
    <Main
      meta={
        <Meta
          title="Shamirs Secrets Demo | EVM Tools"
          description="Understand how shamir's secrets work"
        />
      }
    >
      <ToolBase
        title="Shamir's Secret Demo"
        toolComponent={<ShamirSecretSharingComponent />}
      />
    </Main>
  );
}
