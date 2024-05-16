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
          title="Evm Tools"
          description="Playground for EVM chains | EVM Tools"
        />
      }
    >
      <ToolBase
        title="Evm Tools"
        toolComponent={<PlaygroundListComponent items={playgroundToolsList} />}
      />
    </Main>
  );
}
