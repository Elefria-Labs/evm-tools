import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import AddressBookComponent from '@components/tools/evmtools/AddressBookComponent';
import { pageMeta } from '@config/constants';

export default function AddressBook() {
  return (
    <Main
      meta={
        <Meta
          title={`Address Book | ${pageMeta.appName}`}
          description="Store your EVM addresses in local storage for easy access"
        />
      }
    >
      <ToolBase title="Address Book" toolComponent={<AddressBookComponent />} />
    </Main>
  );
}
