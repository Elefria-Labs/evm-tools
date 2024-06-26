import React, { useState } from 'react';

import { useToast } from '@shadcn-components/ui/use-toast';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { BlockchainNetwork } from '@types';
import { networkConfig } from '@config/network';
import { ZkNetworkCard } from '@components/zk-network-card';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';
import { toastOptions } from '@components/common/toast';
import {
  CardTitle,
  CardContent,
  Card,
  CardHeader,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';

const ZkNetwork = () => {
  const [zkNetworks] = useState<Record<string, any>>(networkConfig);
  const { toast } = useToast();
  const { switchNetwork, connectWallet, disconnect, account, chainId } =
    useWalletConnect();

  const addNetwork = (network?: number) => {
    if (account == null || network == null) {
      toast({
        ...toastOptions,
      });
      return;
    }
    switchNetwork(network);
  };
  return (
    <Main
      meta={
        <Meta
          title={`Zk Block | ${pageMeta.appName}`}
          description="Add RPC Networks to metamask | Zero Knowledge Proofs"
        />
      }
      showConnectWallet={false}
    >
      <ToolBase
        title="Zk Networks"
        toolComponent={
          <>
            <p className="mb-4">
              * in order to add a new network please use connect wallet button
              on this page and select a network.
            </p>
            <div className="flex flex-row content-center justify-between">
              <div className="flex flex-row content-center ">
                {account && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Network</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{`Account: ${truncateAddress(account)}`}</p>
                      <p>{`Chain Id: ${chainId ?? 'No Network'}`}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="ml-4 flex flex-row justify-end">
                {!account ? (
                  <Button onClick={connectWallet}>
                    Connect Wallet {account}
                  </Button>
                ) : (
                  <Button onClick={disconnect}>Disconnect</Button>
                )}
              </div>
            </div>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(zkNetworks)
                .filter((nt: BlockchainNetwork) => nt)
                .map((network: BlockchainNetwork) => (
                  <ZkNetworkCard
                    key={network.name}
                    blockchainNetwork={network}
                    onClickAdd={addNetwork}
                  />
                ))}
            </div>
          </>
        }
      />
    </Main>
  );
};

export default ZkNetwork;
