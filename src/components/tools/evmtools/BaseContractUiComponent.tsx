'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { useChainId, usePublicClient } from 'wagmi';
import { getContractAbi } from '@hooks/useGetContractAbi';
import { Textarea } from '@shadcn-components/ui/textarea';
import ContractUiComponent from './ContractUi/ContractUiComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import { PlusCircledIcon, Cross1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ReadWriteUserContract } from '@store/state';
import { useGlobalStore } from '@store/global-store';
import { isAddress } from 'ethers';
import { useSearchParams, useRouter } from 'next/navigation';
import { Share1Icon, CheckIcon } from '@radix-ui/react-icons';

const BaseContractUiComponent = () => {
  // const contracts = useGlobalStore.use.readWriteUserContracts();
  // const setContracts = useGlobalStore.use.setReadWriteUserContracts();
  const [contracts, setContracts] = useState<ReadWriteUserContract[]>([
    {
      id: '1',
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      abi: '',
      parsedAbi: null,
      parseError: '',
      contractAbi: null,
      abiError: null,
    },
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [abiLoadedFromCache, setAbiLoadedFromCache] = useState<{
    [key: string]: boolean;
  }>({});
  const [mounted, setMounted] = useState(false);
  const [loadedFromUrl, setLoadedFromUrl] = useState(false);
  const [chainMismatch, setChainMismatch] = useState<{
    urlChainId: number;
    connectedChainId: number;
  } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<{
    message: string;
    show: boolean;
  } | null>(null);
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ABI cache store functions
  const saveAbiToCache = useGlobalStore.use.saveAbiToCache();
  const loadAbiFromCache = useGlobalStore.use.loadAbiFromCache();
  const clearAbiFromCache = useGlobalStore.use.clearAbiFromCache();

  // Recent addresses store functions
  const addRecentAddress = useGlobalStore.use.addRecentAddress();
  const removeRecentAddress = useGlobalStore.use.removeRecentAddress();

  // Subscribe to recent addresses changes to trigger re-renders
  const recentAddresses = useGlobalStore.use.recentAddresses();

  const addNewContract = useCallback(() => {
    const newId = (
      parseInt(contracts[contracts.length - 1]!.id) + 1
    ).toString();
    setContracts([
      ...contracts,
      {
        id: newId,
        address: '',
        abi: '',
        parsedAbi: null,
        parseError: '',
        contractAbi: null,
        abiError: null,
      },
    ]);
    setActiveTab(newId);
  }, [contracts, setContracts]);

  const closeContract = useCallback(
    (id: string) => {
      if (contracts.length > 1) {
        const newContracts = contracts.filter((contract) => contract.id !== id);
        setContracts(newContracts);
        setActiveTab(newContracts[0]!.id);
      }
    },
    [contracts, setContracts],
  );

  const updateContract = useCallback(
    (id: string, updates: any) => {
      setContracts(
        contracts.map((contract) =>
          contract.id === id ? { ...contract, ...updates } : contract,
        ),
      );
    },
    [contracts, setContracts],
  );

  // Read URL parameters and prepopulate contract UI
  useEffect(() => {
    if (mounted && searchParams) {
      const urlAddress = searchParams.get('address');
      const urlChainId = searchParams.get('chainId');

      if (urlAddress && isAddress(urlAddress)) {
        // Update the first contract with the URL address
        updateContract('1', { address: urlAddress });
        setLoadedFromUrl(true);

        // Add to recent addresses if chainId is available
        if (chainId) {
          addRecentAddress(urlAddress, chainId);
        }

        // If URL has a specific chainId, check if it matches current chain
        if (urlChainId && chainId) {
          const urlChainIdNum = parseInt(urlChainId);
          if (urlChainIdNum !== chainId) {
            console.log(
              `URL chainId (${urlChainIdNum}) doesn't match connected chain (${chainId})`,
            );
            setChainMismatch({
              urlChainId: urlChainIdNum,
              connectedChainId: chainId,
            });
          } else {
            setChainMismatch(null);
          }
        }
      }
    }
  }, [mounted, searchParams, chainId, addRecentAddress, updateContract]);

  // Function to update URL with contract address and chainId
  const updateUrlWithContract = useCallback(
    (address: string) => {
      if (address && isAddress(address) && chainId) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('address', address);
        params.set('chainId', chainId.toString());

        // Update URL without page reload
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    },
    [searchParams, chainId, router],
  );

  // Function to copy share link
  const copyShareLink = useCallback(
    async (address: string) => {
      if (address && isAddress(address) && chainId) {
        const params = new URLSearchParams();
        params.set('address', address);
        params.set('chainId', chainId.toString());

        const shareUrl = `${window.location.origin}${
          window.location.pathname
        }?${params.toString()}`;

        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopyFeedback({
            message: `Share link for ${address.slice(0, 6)}...${address.slice(
              -4,
            )} copied!`,
            show: true,
          });
          setTimeout(() => setCopyFeedback(null), 3000);
        } catch (err) {
          console.error('Failed to copy share link:', err);
          setCopyFeedback({
            message: 'Failed to copy link',
            show: true,
          });
          setTimeout(() => setCopyFeedback(null), 3000);
        }
      }
    },
    [chainId],
  );

  const fetchAbi = useCallback(
    async (contractId: string, address: string) => {
      if (!address || !chainId) return;
      try {
        const abi = await getContractAbi(address, chainId);
        if (abi == null) {
          updateContract(contractId, {
            abiError:
              'Could not fetch the ABI. Please provide raw ABI below in JSON format!',
          });
        } else {
          updateContract(contractId, { contractAbi: abi, abiError: null });
          // Save ABI to cache when successfully fetched
          saveAbiToCache(address, chainId, abi);
        }
      } catch (error) {
        updateContract(contractId, { abiError: (error as Error).message });
      }
    },
    [chainId, updateContract, saveAbiToCache],
  );

  useEffect(() => {
    const currentContract = contracts.find(
      (contract) => contract.id === activeTab,
    );

    if (
      currentContract &&
      currentContract.address &&
      currentContract.contractAbi == null &&
      !currentContract.abiError &&
      currentContract.abi.length === 0
    ) {
      fetchAbi(currentContract.id, currentContract.address);
    }
  }, [activeTab, contracts, fetchAbi]);

  // useEffect(()=>{
  //   //handle change in network
  //   // remove all the abi
  // },[chainId])

  const handleAddressChange = useCallback(
    (id: string, value: string) => {
      // Clear previous cache status
      setAbiLoadedFromCache((prev) => ({ ...prev, [id]: false }));

      // Clear the "loaded from URL" indicator when user manually changes address
      if (id === '1') {
        setLoadedFromUrl(false);
        setChainMismatch(null);
      }

      // Reset contract state first
      updateContract(id, {
        address: value,
        abi: '',
        parsedAbi: null,
        parseError: '',
        contractAbi: null,
        abiError: null,
      });

      // Check for cached ABI if address is valid and chainId is available
      if (value && chainId && isAddress(value)) {
        // Add to recent addresses when a valid address is entered
        addRecentAddress(value, chainId);

        // Update URL with the new contract address
        updateUrlWithContract(value);

        const cachedAbi = loadAbiFromCache(value, chainId);
        if (cachedAbi) {
          updateContract(id, {
            address: value,
            contractAbi: cachedAbi,
            abiError: null,
          });
          setAbiLoadedFromCache((prev) => ({ ...prev, [id]: true }));
        }
      } else if (!value || !isAddress(value)) {
        // Clear URL parameters if address is empty or invalid
        const params = new URLSearchParams(searchParams.toString());
        params.delete('address');
        params.delete('chainId');
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        router.replace(newUrl, { scroll: false });
      }
    },
    [
      updateContract,
      chainId,
      loadAbiFromCache,
      addRecentAddress,
      updateUrlWithContract,
      searchParams,
      router,
    ],
  );

  const handleAbiChange = useCallback(
    (id: string, value: string) => {
      try {
        const parsedAbi = JSON.parse(value);
        updateContract(id, {
          abi: value,
          parsedAbi,
          parseError: '',
        });

        // Save manually entered ABI to cache if address and chainId are available
        const contract = contracts.find((c) => c.id === id);
        if (contract?.address && chainId && isAddress(contract.address)) {
          saveAbiToCache(contract.address, chainId, parsedAbi);
        }
      } catch (e) {
        updateContract(id, {
          abi: value,
          parsedAbi: null,
          parseError:
            'Invalid ABI, please provide the ABI in the correct format!',
        });
      }
    },
    [updateContract, contracts, chainId, saveAbiToCache],
  );

  const handleClearCache = useCallback(
    (id: string) => {
      const contract = contracts.find((c) => c.id === id);
      if (contract?.address && chainId) {
        clearAbiFromCache(contract.address, chainId);
        setAbiLoadedFromCache((prev) => ({ ...prev, [id]: false }));
        // Reset the contract to refetch ABI
        updateContract(id, {
          contractAbi: null,
          abiError: null,
        });
      }
    },
    [contracts, chainId, clearAbiFromCache, updateContract],
  );

  const handleRemoveRecentAddress = useCallback(
    (address: string) => {
      if (chainId) {
        removeRecentAddress(address, chainId);
      }
    },
    [removeRecentAddress, chainId],
  );

  const memoizedContracts = useMemo(() => contracts, [contracts]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Read-Write Multiple Contracts{' '}
        <span className="italic text-md">(*beta)</span>
      </h1>
      <p className="mt-2 mb-8 italic">
        Use on-chain verified contracts or provide ABI. Anvil/Hardhat enabled
        for local development.
      </p>
      <p className="mt-2 mb-8 italic text-green-500">
        💡 Please connect your wallet to auto fetch verified contracts. This is
        in beta, report any bugs using Feedback.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            {memoizedContracts.map((contract) => (
              <TabsTrigger
                key={contract.id}
                value={contract.id}
                className="flex items-center"
              >
                Contract {contract.id}
                <Cross1Icon
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeContract(contract.id);
                  }}
                />
              </TabsTrigger>
            ))}
          </TabsList>
          <PlusCircledIcon
            className="ml-2 h-6 w-6 cursor-pointer"
            onClick={addNewContract}
          />
        </div>
        {memoizedContracts.map((contract) => (
          <TabsContent key={contract.id} value={contract.id}>
            <div className="flex flex-col sm:flex-row gap-2 mb-2 items-center justify-center">
              <Input
                className="mb-2 sm:mb-0 flex-1"
                value={contract.address}
                onChange={(e) =>
                  handleAddressChange(contract.id, e.target.value)
                }
                placeholder="Contract address"
              />
              {contract.address && isAddress(contract.address) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyShareLink(contract.address)}
                  className="mb-2 sm:mb-0 sm:h-10 sm:px-4"
                  title={`Copy share link for ${contract.address.slice(
                    0,
                    6,
                  )}...${contract.address.slice(-4)}`}
                >
                  <Share1Icon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
            {copyFeedback && copyFeedback.show && (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 animate-in fade-in duration-200 mb-2">
                <CheckIcon className="h-3 w-3 mr-1" />
                {copyFeedback.message}
              </div>
            )}
            {loadedFromUrl && contract.id === '1' && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                ✓ Contract address loaded from URL
              </div>
            )}
            {chainMismatch && contract.id === '1' && (
              <div className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                ⚠️ URL chainId ({chainMismatch.urlChainId}) doesn&apos;t match
                connected chain ({chainMismatch.connectedChainId})
              </div>
            )}
            <div className="text-sm text-gray-500 mb-2">
              Chain ID: {mounted ? chainId || 'Not connected' : 'Loading...'}
            </div>
            {mounted &&
              chainId &&
              recentAddresses.filter((item) => item.chainId === chainId)
                .length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">
                    Recent addresses:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recentAddresses
                      .filter((item) => item.chainId === chainId)
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .slice(0, 8)
                      .map((recent) => (
                        <div
                          key={`${recent.address}-${recent.chainId}-${recent.timestamp}`}
                          className="flex items-center text-xs bg-gray-100 dark:bg-gray-800 rounded border group"
                        >
                          <button
                            onClick={() =>
                              handleAddressChange(contract.id, recent.address)
                            }
                            className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l flex-1"
                            title={recent.address}
                          >
                            {recent.address.slice(0, 6)}...
                            {recent.address.slice(-4)}
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyShareLink(recent.address);
                            }}
                            className="px-1 py-1 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 border-l border-gray-200 dark:border-gray-700"
                            title={`Share ${recent.address.slice(
                              0,
                              6,
                            )}...${recent.address.slice(-4)}`}
                          >
                            <Share1Icon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveRecentAddress(recent.address);
                            }}
                            className="px-1 py-1 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 rounded-r border-l border-gray-200 dark:border-gray-700"
                            title="Remove address"
                          >
                            <Cross1Icon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            {contract.abiError && (
              <div className="text-red-500 mb-4">{contract.abiError}</div>
            )}
            {contract.contractAbi ? (
              <div className="flex items-center justify-between mb-4">
                <div className="text-green-500">
                  Contract ABI loaded successfully{' '}
                  {abiLoadedFromCache[contract.id]
                    ? 'from cache'
                    : `from ${publicClient?.chain?.name}`}
                </div>
                {abiLoadedFromCache[contract.id] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearCache(contract.id)}
                    className="ml-2 h-8 px-2 text-xs"
                  >
                    <TrashIcon className="h-3 w-3 mr-1" />
                    Clear Cache
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Textarea
                  className="my-8"
                  placeholder="Provide contract abi"
                  value={contract.abi}
                  onChange={(e) => handleAbiChange(contract.id, e.target.value)}
                />
                {contract.parseError && (
                  <div className="text-red-500 mb-4">{contract.parseError}</div>
                )}
              </>
            )}
            {chainId == null && (
              <div className="text-yellow-500 mb-4">
                Please connect your wallet!
              </div>
            )}
            {((contract.address && contract.contractAbi != null) ||
              contract.parsedAbi != null) && (
              <ContractUiComponent
                // @ts-ignore
                abi={contract.contractAbi ?? contract.parsedAbi}
                contractAddress={contract.address}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default React.memo(BaseContractUiComponent);
