import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import PersonalSignComponent from '@components/personal-sign/PersonalSignComponent';
import ToolBase from '@components/common/ToolBase';
import { Links, pageMeta } from '@config/constants';

export default function Erc191() {
  return (
    <Main
      meta={
        <Meta
          title={`ERC 191 Signing | ${pageMeta.appName}`}
          description="Sign typed data using ERC-191 | Personal message signing"
        />
      }
      link={Links.erc191}
    >
      <ToolBase
        title="ERC-191 Signature"
        toolComponent={
          <div className="max-w-[640px] lg:max-w-[1024px]">
            {/* <WalletConnectBase /> */}
            <PersonalSignComponent />
          </div>
        }
      />
    </Main>
  );
}
