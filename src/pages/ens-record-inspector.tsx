import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';
import ENSRecordInspectorComponent from '@components/tools/evmtools/EnsRecordsComponent';

export default function EnsRecordInspector() {
  return (
    <Main
      meta={
        <Meta
          title={`ENS Record Inspector | ${pageMeta.appName}`}
          description="Inspect ENS Records such as linked social accounts"
        />
      }
      link={Links.ensRecordInspector}
    >
      <ToolBase
        title="ENS Record Inspector"
        toolComponent={<ENSRecordInspectorComponent />}
      />
    </Main>
  );
}
