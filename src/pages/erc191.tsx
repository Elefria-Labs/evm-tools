import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { PersonalSignComponent } from '@components/personal-sign/PersonalSignComponent';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Erc191() {
  return (
    <Main
      meta={
        <Meta
          title="ERC 191 Signing | Zk block"
          description="Sign typed data using ERC-191 | Personal message signing"
        />
      }
    >
      <div className="max-w-[640px] lg:max-w-[1024px]">
        <h1 className="font-bold my-8">ERC-191 Signature</h1>
        <div className="flex flex-row justify-end">
          <ConnectButton />
        </div>
        <PersonalSignComponent />
      </div>
    </Main>
  );
}
