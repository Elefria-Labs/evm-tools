import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';

export default function Cheatsheet() {
  return (
    <Main
      meta={
        <Meta
          title={`Solidity Cheatsheet | ${pageMeta.appName}`}
          description="Solidity helpers"
        />
      }
      link={Links.cheatsheet}
    >
      <ToolBase
        title="Solidity helpers"
        toolComponent={<CheatsheetComponent />}
      />
    </Main>
  );
}
