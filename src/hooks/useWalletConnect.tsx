import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { ethers } from 'ethers';
import { getNetworkForMetamask, networkConfig } from '@config/network';
import { toHex } from '@utils/wallet';

export const networkOptions = Object.values(networkConfig);

type UseWalletConnectReturnType = {
  provider: ethers.JsonRpcProvider | undefined;
  connectWallet: () => void;
  disconnect: () => Promise<void>;
  account: string | undefined;
  chainId: number | undefined;
  network: number | undefined;
  switchNetwork: (network: number | undefined) => void;
  setNetwork: Dispatch<SetStateAction<number | undefined>>;
};
export const useWalletConnect = (): UseWalletConnectReturnType => {
  const [provider, setProvider] = useState<
    ethers.JsonRpcProvider | undefined
  >();
  const [account, setAccount] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState<number | undefined>();
  const [network, setNetwork] = useState<number | undefined>();

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window?.ethereum == null) {
      return;
    }
    try {
      const web3provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
        window.ethereum,
      );
      const accounts = await web3provider.send('eth_requestAccounts', []);
      const providerNetwork = await web3provider.getNetwork();

      setProvider(web3provider);
      if (accounts) {
        setAccount(accounts[0]);
      }

      setChainId(Number(providerNetwork.chainId));
    } catch (error) {
      console.log('Error connecting wallet:', error);
      setError('Error connecting to wallet.');
    }
  }, []);

  const switchNetwork = useCallback(
    async (network?: number) => {
      if (network == null || provider == null || provider?.provider == null) {
        return;
      }
      try {
        // @ts-ignore
        await provider?.provider?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: toHex(network) }],
        });
        connectWallet();
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          try {
            // @ts-ignore
            await provider?.provider?.request({
              method: 'wallet_addEthereumChain',
              params: [
                getNetworkForMetamask(
                  Object.assign({}, networkConfig[toHex(network)]),
                ),
              ],
            });
            connectWallet();
          } catch (error) {
            setError('Error switching wallet.');
          }
        }
      }
    },
    [provider],
  );
  const refreshState = () => {
    setAccount('');
    setChainId(undefined);
    setNetwork(undefined);
  };
  const disconnect = useCallback(async () => {
    refreshState();
  }, []);

  useEffect(() => {
    if (provider == null || provider?.on == null) {
      return;
    }
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string) => {
        if (accounts) setAccount(accounts);
      };

      const handleChainChanged = (_hexChainId: number) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      return () => {
        if (provider == null || provider?.removeListener == null) {
          return;
        }
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
        provider.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [provider, disconnect, error]);

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && window?.ethereum == null) {
  //     return;
  //   }
  //   connectWallet();
  // }, [connectWallet]);

  useEffect(() => {
    if (provider == null || chainId == null) {
      return;
    }

    if (chainId === network) {
      return;
    }

    switchNetwork(network);
  }, [provider, chainId, network, switchNetwork]);

  return {
    provider,
    account,
    network,
    chainId,
    connectWallet,
    disconnect,
    switchNetwork,
    setNetwork,
  };
};
