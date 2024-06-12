import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';

export default function MerkleTreeGenerator() {
  return (
    <Main
      meta={
        <Meta
          title={`Merkle Tree Generator | ${pageMeta.appName}`}
          description="Generate merkle trees and verify leaves"
        />
      }
    >
      <ToolBase
        title="Merkle Tree Generator"
        toolComponent={<MerkleTreeVerifier />}
      />
    </Main>
  );
}
