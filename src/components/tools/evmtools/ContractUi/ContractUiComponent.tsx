import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@shadcn-components/ui/card';
import { Label } from '@shadcn-components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@shadcn-components/ui/accordion';

import { useChainId } from 'wagmi';
import { useEthersSigner } from '@hooks/useEthersSigner';
import { Checkbox } from '@shadcn-components/ui/checkbox';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Badge } from '@shadcn-components/ui/badge';

interface ContractFunction {
  name: string;
  inputs: { name: string; type: string }[];
  outputs: { name: string; type: string }[];
  stateMutability: string;
}

interface ContractUiComponentProps {
  abi: any[];
  contractAddress: string;
}

const ContractUiComponent: React.FC<ContractUiComponentProps> = ({
  abi,
  contractAddress,
}) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [readFunctions, setReadFunctions] = useState<ContractFunction[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<ContractFunction[]>([]);
  const [results, setResults] = useState<{
    [key: string]: { value: string; type: string };
  }>({});
  const [selectedFunctions, setSelectedFunctions] = useState<Set<string>>(
    new Set(),
  );
  const [showOnlySelected, setShowOnlySelected] = useState<boolean>(false);
  const chainId = useChainId();
  // const signer = useEthersProvider({ chainId });
  const [autoFetchedResults, setAutoFetchedResults] = useState<{
    [key: string]: { value: string; type: string };
  }>({});
  const signer = useEthersSigner({ chainId });

  useEffect(() => {
    const initContract = async () => {
      if (chainId == null) {
        return;
      }
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      setContract(smartContract);

      const contractFunctions = abi.filter(
        (item: any) => item.type === 'function',
      );
      const allReadFuncs = contractFunctions.filter(
        (func: ContractFunction) =>
          func.stateMutability === 'view' || func.stateMutability === 'pure',
      );

      // Separate auto-fetchable functions
      const autoFetchableFuncs = allReadFuncs.filter(
        (func) => func.inputs.length === 0,
      );
      const manualReadFuncs = allReadFuncs.filter(
        (func) => func.inputs.length > 0,
      );

      setReadFunctions(manualReadFuncs);
      setWriteFunctions(
        contractFunctions.filter(
          (func: ContractFunction) =>
            func.stateMutability !== 'view' && func.stateMutability !== 'pure',
        ),
      );

      // Auto-fetch results for read functions with no inputs
      await fetchAutoFetchableResults(smartContract, autoFetchableFuncs);
    };

    initContract();
  }, [abi, contractAddress, chainId, signer]);

  const fetchAutoFetchableResults = async (
    smartContract: ethers.Contract,
    funcs: ContractFunction[],
  ) => {
    const autoFetchPromises = funcs.map(async (func) => {
      try {
        const result = await smartContract[func.name]();
        return [
          func.name,
          {
            value: formatResult(result),
            type: func.outputs[0]?.type || 'unknown',
          },
        ];
      } catch (error) {
        console.error(`Error fetching ${func.name}:`, error);
        return [func.name, { value: 'Error fetching result', type: 'error' }];
      }
    });

    const autoFetchedResults = Object.fromEntries(
      await Promise.all(autoFetchPromises),
    );
    setAutoFetchedResults(autoFetchedResults);
  };

  const refreshAutoFetchedResult = async (funcName: string) => {
    if (!contract) return;
    try {
      const result = await contract[funcName]();
      const func = abi.find((item: any) => item.name === funcName);
      setAutoFetchedResults((prev) => ({
        ...prev,
        [funcName]: {
          value: formatResult(result),
          type: func?.outputs[0]?.type || 'unknown',
        },
      }));
    } catch (error) {
      console.error(`Error refreshing ${funcName}:`, error);
      setAutoFetchedResults((prev) => ({
        ...prev,
        [funcName]: { value: 'Error refreshing result', type: 'error' },
      }));
    }
  };
  const toggleFunctionSelection = (funcName: string) => {
    setSelectedFunctions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(funcName)) {
        newSet.delete(funcName);
      } else {
        newSet.add(funcName);
      }
      return newSet;
    });
  };
  const handleFunctionCall = async (func: ContractFunction) => {
    if (!contract) return;

    const inputValues = func.inputs.map((input) => {
      const inputElement = document.getElementById(
        `${func.name}-${input.name}`,
      ) as HTMLInputElement;
      const value = inputElement.value;

      // Handle struct inputs
      if (input.type.startsWith('tuple')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error(`Invalid JSON for struct parameter ${input.name}`);
        }
      }

      // Handle array inputs
      if (input.type.includes('[]')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error(`Invalid JSON for array parameter ${input.name}`);
        }
      }

      return value;
    });

    try {
      let result;
      if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
        result = await contract[func.name](...inputValues);
      } else {
        const options: { value?: ethers.BigNumber } = {};
        if (func.stateMutability === 'payable') {
          const valueInput = document.getElementById(
            `${func.name}-value`,
          ) as HTMLInputElement;
          const value = valueInput.value;
          if (value) {
            options.value = ethers.BigNumber.from(value);
          }
        }
        const tx = await contract[func.name](...inputValues, options);
        setTxLoading(true);
        await tx.wait();
        result = 'Transaction successful';
        setTxLoading(false);
      }

      const formattedResult = formatResult(result);
      const returnType = func.outputs[0]?.type || 'void';

      setResults((prevResults) => ({
        ...prevResults,
        [func.name]: { value: formattedResult, type: returnType },
      }));
    } catch (error) {
      console.error('Error calling function:', error);
      setResults((prevResults) => ({
        ...prevResults,
        [func.name]: {
          value: 'Error: ' + (error as Error).message,
          type: 'error',
        },
      }));
    }
  };

  const formatResult = (result: any): string => {
    if (result === null || result === undefined) {
      return 'null';
    }
    if (typeof result === 'bigint') {
      return result.toString();
    }
    if (Array.isArray(result)) {
      return JSON.stringify(result.map(formatResult), null, 2);
    }
    if (typeof result === 'object') {
      if (Object.prototype.hasOwnProperty.call(result, 'toString')) {
        return result.toString();
      }
      return JSON.stringify(
        Object.fromEntries(
          Object.entries(result).map(([key, value]) => [
            key,
            formatResult(value),
          ]),
        ),
        null,
        2,
      );
    }
    return JSON.stringify(result, null, 2);
  };

  const renderFunctions = (functions: ContractFunction[], title: string) => (
    <>
      <h2 className="text-xl font-semibold mt-6 mb-4">{title}</h2>

      <Accordion type="multiple" className="w-full">
        {functions
          .filter(
            (func) => !showOnlySelected || selectedFunctions.has(func.name),
          )
          .map((func) => (
            <AccordionItem key={func.name} value={func.name}>
              <AccordionTrigger className="flex justify-between">
                <div className="flex flex-row items-center">
                  <Checkbox
                    checked={selectedFunctions.has(func.name)}
                    onCheckedChange={() => toggleFunctionSelection(func.name)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-4"
                  />
                  <span>{func.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>{func.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {func.inputs.map((input) => (
                      <div key={input.name} className="mb-4">
                        <Label htmlFor={`${func.name}-${input.name}`}>
                          {input.name} ({input.type})
                        </Label>
                        {input.type.startsWith('tuple') ||
                        input.type.includes('[]') ? (
                          <textarea
                            id={`${func.name}-${input.name}`}
                            placeholder={`Enter ${input.name} as JSON`}
                            className="mt-1 w-full p-2 border rounded"
                            rows={4}
                          />
                        ) : (
                          <Input
                            id={`${func.name}-${input.name}`}
                            placeholder={`Enter ${input.name}`}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                    {func.stateMutability === 'payable' && (
                      <div className="mb-4">
                        <Label htmlFor={`${func.name}-value`}>
                          Value (in wei)
                        </Label>
                        <Input
                          id={`${func.name}-value`}
                          type="number"
                          placeholder="Enter value in wei"
                          className="mt-1"
                        />
                      </div>
                    )}
                    <Button
                      onClick={() => handleFunctionCall(func)}
                      className="mt-2"
                    >
                      {func.stateMutability === 'view' ||
                      func.stateMutability === 'pure'
                        ? 'Call'
                        : 'Execute'}
                    </Button>

                    {txLoading && <div className="mt-4">Loading.....</div>}
                    {results[func.name] && (
                      <div className="mt-4">
                        <div className="flex items-center">
                          <h4 className="font-semibold mr-2">Result:</h4>
                          <Badge>{results[func.name]!.type}</Badge>
                        </div>
                        <pre className="dark:bg-gray-500 bg-gray-200 p-2 rounded mt-1 overflow-x-auto">
                          {results[func.name]!.value}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );

  return (
    <div className="mt-4">
      {Object.keys(autoFetchedResults).length > 0 && (
        <Accordion type="single" collapsible className="w-full mb-6">
          <AccordionItem value="contract-details">
            <AccordionTrigger className="text-lg">
              Contract Details
            </AccordionTrigger>
            <AccordionContent>
              {Object.entries(autoFetchedResults).map(([funcName, result]) => (
                <div
                  key={funcName}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center w-full">
                    <div className="w-4/12">
                      <strong className="mr-2">{funcName}</strong>
                      <Badge>{result.type}</Badge>
                    </div>
                    <div className="w-4/12">{result.value}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => refreshAutoFetchedResult(funcName)}
                    className="ml-2 p-1"
                  >
                    <ReloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="mb-4 flex flex-row items-center">
        <Checkbox
          checked={showOnlySelected}
          onCheckedChange={(checked) => setShowOnlySelected(checked as boolean)}
        />
        <label className="ml-2">Show only selected</label>
      </div>
      {renderFunctions(readFunctions, 'Read Functions')}
      {renderFunctions(writeFunctions, 'Write Functions')}
    </div>
  );
};

export default ContractUiComponent;
