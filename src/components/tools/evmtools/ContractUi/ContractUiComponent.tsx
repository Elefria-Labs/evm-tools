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

import { ReloadIcon, CopyIcon } from '@radix-ui/react-icons';
import { Badge } from '@shadcn-components/ui/badge';

interface ContractFunction {
  name: string;
  inputs: { name: string; type: string }[];
  outputs: { name: string; type: string }[];
  stateMutability: string;
}

interface AbiOutput {
  name: string;
  type: string;
}

interface ParsedResult {
  value: any;
  formattedValue: string;
  type: string;
  outputs: AbiOutput[];
}

interface ContractUiComponentProps {
  abi: any[];
  contractAddress: string;
}

// ABI parsing utilities
const formatValueByType = (value: any, type: string): any => {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (type === 'address') {
    return value;
  }

  if (type.startsWith('uint') || type.startsWith('int')) {
    return formatBigNumber(value, type);
  }

  if (type.startsWith('bytes')) {
    return formatBytes(value);
  }

  if (type === 'bool') {
    return value.toString();
  }

  if (type === 'string') {
    return value;
  }

  return value.toString();
};

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatBigNumber = (value: any, type: string): string => {
  const num = BigInt(value.toString());
  return num.toString();
};

const formatBytes = (value: any): string => {
  if (typeof value === 'string' && value.startsWith('0x')) {
    return value;
  }
  return ethers.hexlify(value);
};

const formatArrayOrTuple = (value: any, outputs: AbiOutput[]): string => {
  if (Array.isArray(value)) {
    if (outputs.length === 1 && outputs[0]!.type.includes('[]')) {
      // Simple array
      return JSON.stringify(
        value.map((v) =>
          formatValueByType(v, outputs[0]!.type.replace('[]', '')),
        ),
        null,
        2,
      );
    } else {
      // Tuple/struct - use proper field names
      const formatted: { [key: string]: any } = {};
      outputs.forEach((output, index) => {
        // Use the actual field name from ABI, fallback to index only if truly empty
        const key =
          output.name && output.name.trim() ? output.name : `${index}`;
        formatted[key] = formatValueByType(value[index], output.type);
      });
      return JSON.stringify(formatted, null, 2);
    }
  }
  return JSON.stringify(value, null, 2);
};

const formatResultByAbi = (result: any, outputs: AbiOutput[]): ParsedResult => {
  if (outputs.length === 0) {
    return {
      value: result,
      formattedValue: 'void',
      type: 'void',
      outputs: [],
    };
  }

  if (outputs.length === 1) {
    const output = outputs[0]!;
    return {
      value: result,
      formattedValue: formatValueByType(result, output.type),
      type: output.type,
      outputs,
    };
  }

  // Multiple outputs - treat as tuple
  return {
    value: result,
    formattedValue: formatArrayOrTuple(result, outputs),
    type: 'tuple',
    outputs,
  };
};

const ContractUiComponent: React.FC<ContractUiComponentProps> = ({
  abi,
  contractAddress,
}) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [readFunctions, setReadFunctions] = useState<ContractFunction[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<ContractFunction[]>([]);
  const [results, setResults] = useState<{
    [key: string]: ParsedResult;
  }>({});
  const [selectedFunctions, setSelectedFunctions] = useState<Set<string>>(
    new Set(),
  );
  const [showOnlySelected, setShowOnlySelected] = useState<boolean>(false);
  const chainId = useChainId();

  const [autoFetchedResults, setAutoFetchedResults] = useState<{
    [key: string]: ParsedResult;
  }>({});
  const [copyFeedback, setCopyFeedback] = useState<{
    [key: string]: boolean;
  }>({});
  const signer = useEthersSigner({ chainId });

  const copyToClipboard = async (text: string, feedbackKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback((prev) => ({ ...prev, [feedbackKey]: true }));
      setTimeout(() => {
        setCopyFeedback((prev) => ({ ...prev, [feedbackKey]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchAutoFetchableResults = async (
    smartContract: ethers.Contract,
    funcs: ContractFunction[],
  ) => {
    const autoFetchPromises = funcs.map(async (func) => {
      try {
        if (smartContract == null || smartContract?.[func.name] == null) {
          return;
        }
        // @ts-ignore
        const result = await smartContract[func.name]();
        const parsedResult = formatResultByAbi(result, func.outputs);
        return [func.name, parsedResult];
      } catch (error) {
        console.error(`Error fetching ${func.name}:`, error);
        return [
          func.name,
          {
            value: 'Error fetching result',
            formattedValue: 'Error fetching result',
            type: 'error',
            outputs: [],
          },
        ];
      }
    });

    const autoFetchedResults = Object.fromEntries(
      // @ts-ignore
      await Promise.all(autoFetchPromises),
    );
    setAutoFetchedResults(autoFetchedResults);
  };

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

  const refreshAutoFetchedResult = async (funcName: string) => {
    if (!contract) return;
    try {
      // @ts-ignore
      const result = await contract[funcName]();
      const func = abi.find((item: any) => item.name === funcName);
      const parsedResult = formatResultByAbi(result, func?.outputs || []);
      setAutoFetchedResults((prev) => ({
        ...prev,
        [funcName]: parsedResult,
      }));
    } catch (error) {
      console.error(`Error refreshing ${funcName}:`, error);
      setAutoFetchedResults((prev) => ({
        ...prev,
        [funcName]: {
          value: 'Error refreshing result',
          formattedValue: 'Error refreshing result',
          type: 'error',
          outputs: [],
        },
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
        // @ts-ignore
        result = await contract[func.name](...inputValues);
      } else {
        const options: { value?: ethers.BigNumberish } = {};
        if (func.stateMutability === 'payable') {
          const valueInput = document.getElementById(
            `${func.name}-value`,
          ) as HTMLInputElement;
          const value = valueInput.value;
          if (value) {
            options.value = ethers.toBigInt(value);
          }
        }
        // @ts-ignore
        const tx = await contract[func.name](...inputValues, options);
        setTxLoading(true);
        await tx.wait();
        result = 'Transaction successful';
        setTxLoading(false);
      }

      const parsedResult = formatResultByAbi(result, func.outputs);

      setResults((prevResults) => ({
        ...prevResults,
        [func.name]: parsedResult,
      }));
    } catch (error) {
      console.error('Error calling function:', error);
      setResults((prevResults) => ({
        ...prevResults,
        [func.name]: {
          value: 'Error: ' + (error as Error).message,
          formattedValue: 'Error: ' + (error as Error).message,
          type: 'error',
          outputs: [],
        },
      }));
    }
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
                          {results[func.name]!.formattedValue}
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
                  className="border rounded p-3 mb-3 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <strong className="mr-2">{funcName}</strong>
                      <Badge variant="outline">{result.type}</Badge>
                      {result.outputs.length > 1 && (
                        <Badge variant="secondary" className="ml-1">
                          {result.outputs.length} outputs
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(result.formattedValue, funcName)
                        }
                        className="h-8 w-8 p-0"
                        title={
                          copyFeedback[funcName] ? 'Copied!' : 'Copy value'
                        }
                      >
                        {copyFeedback[funcName] ? (
                          <span className="text-green-500 text-xs">✓</span>
                        ) : (
                          <CopyIcon className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refreshAutoFetchedResult(funcName)}
                        className="h-8 w-8 p-0"
                      >
                        <ReloadIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {result.type === 'address' ? (
                    <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border block">
                      {result.formattedValue}
                    </code>
                  ) : result.type === 'tuple' || result.outputs.length > 1 ? (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-sm font-medium mb-2">
                        View details ({result.outputs.length} fields)
                      </summary>
                      <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
                        {result.formattedValue}
                      </pre>
                    </details>
                  ) : (
                    <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border block">
                      {result.formattedValue}
                    </code>
                  )}
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
