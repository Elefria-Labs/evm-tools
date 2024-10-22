import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import PurchaseCalculator from '@components/tools/market/AssetPrice';

export default function Calculators() {
  return (
    <Main
      meta={
        <Meta
          title="Price Calculator | EVM Tools"
          description="Calculate asset price and more"
        />
      }
    >
      <PurchaseCalculator />
    </Main>
  );
}
