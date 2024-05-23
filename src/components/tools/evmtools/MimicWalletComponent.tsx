import React, { useCallback, useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { Label } from '@shadcn-components/ui/label';
import { Core } from '@walletconnect/core';
import {
  Web3Wallet,
  IWeb3Wallet,
  Web3WalletTypes,
} from '@walletconnect/web3wallet';

import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { ethers } from 'ethers';
import { Button } from '@shadcn-components/ui/button';
import BaseInputAddressBook from '@components/common/BaseInputAddressBook';

// https://docs.walletconnect.com/web3wallet/wallet-usage
const core = new Core({
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
});

export default function MimicWalletComponent() {
  const [wcUri, setWcUri] = useState<string>('');

  const [addressToMimic, setAddressToMimic] = useState<string | null>();
  // const [ensAddress, setEnsAddress] = useState<string | null>();
  const [mimicStatus, setMimicStatus] = useState<string | null>();
  const [activeSession, setActiveSession] =
    useState<SessionTypes.Struct | null>();

  const { toast } = useToast();
  const [wcWeb3Wallet, setWcWeb3Wallet] = useState<IWeb3Wallet | undefined>(
    undefined,
  );

  const onSessionRequest = useCallback(
    async (sessionRequest: Web3WalletTypes.SessionRequest) => {
      if (wcWeb3Wallet == null || addressToMimic == null) {
        return;
      }

      console.log('session request', sessionRequest);
    },
    [wcWeb3Wallet, addressToMimic],
  );

  const onSessionProposal = useCallback(
    async ({ id, params }: Web3WalletTypes.SessionProposal) => {
      if (wcWeb3Wallet == null || addressToMimic == null) {
        return;
      }
      try {
        // ------- namespaces builder util ------------ //
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: params,
          supportedNamespaces: {
            eip155: {
              chains: ['eip155:1'], // TODO add more chains
              methods: ['eth_sendTransaction', 'personal_sign'],
              events: ['accountsChanged', 'chainChanged'],
              accounts: [`eip155:1:${addressToMimic}`],
            },
          },
        });

        const session = await wcWeb3Wallet.approveSession({
          id,
          namespaces: approvedNamespaces,
        });
        setActiveSession(session);
      } catch (error) {
        // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful

        await wcWeb3Wallet.rejectSession({
          id: params.id,
          reason: getSdkError('USER_REJECTED'),
        });
        setMimicStatus('');
        toast({
          ...toastOptions,
          title: 'Connection attempt was unsuccessful!',
          description: (error as Error).message,
        });
      }
    },
    [toast, wcWeb3Wallet, addressToMimic],
  );

  useEffect(() => {
    const walletInit = async () => {
      const wallet = await Web3Wallet.init({
        core, // <- pass the shared `core` instance
        metadata: {
          name: 'EVM Tools',
          description: 'Tools for web3',
          url: 'www.evmtools.xyz',
          icons: [
            'https://evmtools-dev.web.app/assets/images/evm-tools-logo-2.svg',
          ],
        },
      });
      if (wallet) {
        setWcWeb3Wallet(wallet);
      }
    };
    walletInit();
    // return () => {
    //   if (wcWeb3Wallet == null) {
    //     return;
    //   }
    //   // wcWeb3Wallet.removeListener('session_proposal', onSessionProposal);
    //   // wcWeb3Wallet.removeListener('session_request', onSessionRequest);
    // };
  }, []);

  const connectToUri = useCallback(
    async (uri: string) => {
      if (wcWeb3Wallet == null || activeSession != null) {
        return;
      }
      wcWeb3Wallet.on('session_proposal', onSessionProposal);
      wcWeb3Wallet.on('session_request', onSessionRequest);
      await wcWeb3Wallet.pair({ uri });
    },
    [wcWeb3Wallet, activeSession, onSessionProposal, onSessionRequest],
  );

  const disconnectSession = useCallback(async () => {
    if (wcWeb3Wallet == null || activeSession == null) {
      return;
    }
    await wcWeb3Wallet.disconnectSession({
      topic: activeSession?.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
    setWcUri('');
    setActiveSession(null);
    toast({
      ...toastOptions,
      title: 'Session disconnected!',
      variant: 'default',
    });
    setMimicStatus('Disconnected!');
  }, [wcWeb3Wallet, activeSession, toast]);

  const connectSession = async () => {
    if (
      wcWeb3Wallet == null ||
      addressToMimic == null ||
      wcUri == null ||
      activeSession != null
    ) {
      return;
    }

    if (ethers.utils.isAddress(addressToMimic) == false) {
      toast({
        ...toastOptions,
        title: 'Invalid address!',
      });
      // try {
      //   const resolveEns = await publicClient.getEnsResolver(
      //     addressToMimic as any,
      //   );
      //   setEnsAddress(resolveEns);
      // } catch (e) {
      //   toast({
      //     ...toastOptions,
      //     title: 'Invalid address!',
      //   });
      // }
    }
    setMimicStatus('Connecting....');
    // wcWeb3Wallet.on('session_proposal', onSessionProposal);
    connectToUri(wcUri);
    setMimicStatus('Mimic success!');
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[480px] w-[100%]">
        <Label htmlFor="rawTx" className="mb-4">
          Address To Mimic (EOA or Multisig)
        </Label>
        <p className="text-xs">*Currently only supports Ethereum mainnet</p>
        {/* <Input
          className="sm:w-84"
          placeholder="Enter wallet address, 0x123abc"
          value={addressToMimic ?? ''}
          onChange={(e) => {
            const addr = e.target.value;

            // setEnsAddress(null);
            setAddressToMimic(addr);
          }}
        /> */}

        <BaseInputAddressBook
          className="sm:w-84"
          placeholder="Enter wallet address, 0x123abc"
          value={addressToMimic ?? ''}
          onChange={(e) => {
            const addr = e.target.value;

            // setEnsAddress(null);
            setAddressToMimic(addr);
          }}
        />
        {/* {ensAddress && <p>{ensAddress}</p>} */}
        <Label htmlFor="rawTx" className="mb-4">
          Wallet Connect URI
        </Label>
        <Input
          className="sm:w-84"
          placeholder="Enter wallet connect URI"
          value={wcUri}
          onChange={(e) => setWcUri(e.target.value)}
        />
        {mimicStatus}

        {activeSession == null ? (
          <Button
            className="mt-4 w-full"
            onClick={connectSession}
            disabled={
              !wcWeb3Wallet || !!activeSession || !wcUri || !addressToMimic
            }
          >
            Connect Session
          </Button>
        ) : (
          <Button
            className="mt-4 w-full"
            onClick={disconnectSession}
            disabled={!wcWeb3Wallet || !activeSession}
          >
            Disconnect Session
          </Button>
        )}
      </div>
    </div>
  );
}
