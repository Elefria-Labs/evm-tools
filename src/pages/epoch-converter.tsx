import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import EpochConverterComponent from '@components/tools/evmtools/EpochConverterComponent';
import { pageMeta } from '@config/constants';

export default function EpochConverter() {
  return (
    <Main
      meta={
        <Meta
          title={`Epoch Converter | ${pageMeta.appName}`}
          description="Time helpers, seconds converter, convert between unix timestamp and readable date format"
        />
      }
    >
      <ToolBase
        title=""
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            <EpochConverterComponent />
          </div>
        }
      />
    </Main>
  );
}
