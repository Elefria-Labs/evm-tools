import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { useChainId } from 'wagmi';
import useGetContractAbi from '@hooks/useGetContractAbi';
import { Textarea } from '@shadcn-components/ui/textarea';
import ContractUiComponent from './ContractUi/ContractUiComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import { PlusCircledIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useGlobalStore } from '@store/global-store';

const BaseContractUiComponent = () => {
  const contracts = useGlobalStore.use.readWriteUserContracts();
  const setContracts = useGlobalStore.use.setReadWriteUserContracts();

  const [activeTab, setActiveTab] = useState('1');
  const chainId = useChainId();

  const { getAbi, error: abiError, loading } = useGetContractAbi(chainId);

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

    setActiveTab((prevActiveTab) => (parseInt(prevActiveTab) + 1).toString());
  }, []);

  const closeContract = useCallback((id: string) => {
    if (contracts.length > 1) {
      const newContracts = contracts.filter((contract) => contract.id !== id);
      setActiveTab(newContracts[0]!.id);
      setContracts(newContracts);
      return;
    }
  }, []);

  const updateContract = useCallback(
    (id: string, field: string, value: string | any[] | null) => {
      const newContracts = contracts.map((contract) => {
        if (contract.id === id) {
          if (field == 'address') {
            // reset errors/abis in this case
            return {
              ...contract,
              address: value as string,
              abi: '',
              parsedAbi: null,
              parseError: '',
              contractAbi: null,
              abiError: null,
            };
          }
          return { ...contract, [field]: value };
        }
        return contract;
      });
      setContracts(newContracts);
    },
    [],
  );

  useEffect(() => {
    const fetchAbi = async () => {
      const currentContract = contracts.find(
        (contract) => contract.id === activeTab,
      );
      if (
        currentContract &&
        currentContract.address &&
        currentContract.abi.length === 0 &&
        !currentContract.contractAbi &&
        !currentContract.abiError
      ) {
        try {
          console.log('truing to get raonct ', currentContract);
          const abi = await getAbi(currentContract.address);
          updateContract(activeTab, 'contractAbi', abi);
          updateContract(activeTab, 'abiError', null);
        } catch (error) {
          updateContract(activeTab, 'abiError', (error as Error).message);
        }
      }
    };

    fetchAbi();
  }, [activeTab, chainId, contracts, getAbi, updateContract]);

  const handleAbiChange = useCallback(
    (id: string, value: string) => {
      try {
        const parsedAbi = JSON.parse(value);
        updateContract(id, 'abi', value);
        updateContract(id, 'parsedAbi', parsedAbi);
        updateContract(id, 'parseError', '');
      } catch (e) {
        updateContract(id, 'abi', value);
        updateContract(id, 'parsedAbi', null);
        updateContract(
          id,
          'parseError',
          'Invalid ABI, please provide the ABI in the correct format!',
        );
      }
    },
    [updateContract],
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Read-Write Contracts</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            {contracts.map((contract) => (
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
        {contracts.map((contract) => (
          <TabsContent key={contract.id} value={contract.id}>
            <Input
              className="mb-4"
              value={contract.address}
              onChange={(e) =>
                updateContract(contract.id, 'address', e.target.value)
              }
              placeholder="Contract address"
            />
            {contract.abiError && (
              <div className="text-red-500 mb-4">{contract.abiError}</div>
            )}
            {contract.contractAbi ? (
              <div>Contract ABI loaded successfully</div>
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
                //@ts-ignore
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

export default BaseContractUiComponent;
