import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { playgroundToolsList } from '@data/playground';
import { PlaygroundListComponent } from '@components/playground/PlaygroundListItem';
import ToolBase from '@components/common/ToolBase';

export default function DevTools() {
  return (
    <Main
      meta={
        <Meta
          title="All EVM Tools"
          description="Ethereum Tools for EVM chains | EVM Tools"
        />
      }
    >
      <ToolBase
        title="All EVM Tools"
        toolComponent={<PlaygroundListComponent items={playgroundToolsList} />}
      />
    </Main>
  );
}
