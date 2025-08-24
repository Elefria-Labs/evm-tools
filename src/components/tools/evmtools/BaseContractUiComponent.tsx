'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@shadcn-components/ui/input';
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
import { PlusCircledIcon, Cross1Icon } from '@radix-ui/react-icons';
import { ReadWriteUserContract } from '@store/state';

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
  const chainId = useChainId();
  const publicClient = usePublicClient();

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

  const fetchAbi = useCallback(
    async (contractId: string, address: string) => {
      if (!address) return;
      try {
        const abi = await getContractAbi(address, chainId);
        if (abi == null) {
          updateContract(contractId, {
            abiError:
              'Could not fetch the ABI. Please provide raw ABI below in JSON format!',
          });
        } else {
          updateContract(contractId, { contractAbi: abi, abiError: null });
        }
      } catch (error) {
        updateContract(contractId, { abiError: (error as Error).message });
      }
    },
    [chainId, updateContract],
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
      updateContract(id, {
        address: value,
        abi: '',
        parsedAbi: null,
        parseError: '',
        contractAbi: null,
        abiError: null,
      });
    },
    [updateContract],
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
      } catch (e) {
        updateContract(id, {
          abi: value,
          parsedAbi: null,
          parseError:
            'Invalid ABI, please provide the ABI in the correct format!',
        });
      }
    },
    [updateContract],
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
        Please connect your wallet to auto fetch verified contracts. This is in
        beta, report any bugs using Feedback.
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
            <Input
              className="mb-4"
              value={contract.address}
              onChange={(e) => handleAddressChange(contract.id, e.target.value)}
              placeholder="Contract address"
            />
            {contract.abiError && (
              <div className="text-red-500 mb-4">{contract.abiError}</div>
            )}
            {contract.contractAbi ? (
              <div className="text-green-500 mb-4">
                Contract ABI loaded successfully from{' '}
                {publicClient?.chain?.name}
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
