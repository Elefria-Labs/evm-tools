import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { Eip712PlaygroundComponent } from '@components/eip712-playground/Eip712Component';
import WalletConnectBase from '@components/common/WalletConnectBase';
import ToolBase from '@components/common/ToolBase';

export default function Eip712() {
  const { connectWallet, disconnect, account, provider } = useWalletConnect();
  return (
    <Main
      meta={
        <Meta
          title="EIP 712 Signing | Zk block"
          description="Sign typed data using EIP-712"
        />
      }
    >
      <ToolBase
        title="EIP-712 Signature"
        toolComponent={
          <>
            <WalletConnectBase />
            <Eip712PlaygroundComponent provider={provider} address={account} />
          </>
        }
      />
    </Main>
  );
}
