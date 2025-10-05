import React, { useState } from 'react';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Label } from '@shadcn-components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';

import { useToast } from '@shadcn-components/ui/use-toast';
import {
  PlayIcon,
  ReloadIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { toastOptions } from '@components/common/toast';
import {
  isHex,
  parseTransaction,
  Address,
  TransactionRequest,
  Hash,
} from 'viem';
import { usePublicClient } from 'wagmi';
import { chainId } from '@utils/wallet';

interface RawTransactionData {
  type?: string;
  chainId?: number;
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  nonce?: number;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  authorizationList?: Array<{
    chainId: number;
    address: string;
    nonce: number;
    yParity: number;
    r: string;
    s: string;
  }>;
}

interface TransactionResult {
  hash: Hash;
  receipt?: any;
  error?: string;
}

const RawTransactionSubmitter: React.FC = () => {
  const { toast } = useToast();
  const publicClient = usePublicClient();

  // State
  const [rawTransaction, setRawTransaction] = useState('');
  const [parsedTransaction, setParsedTransaction] =
    useState<RawTransactionData | null>(null);
  const [isValidTransaction, setIsValidTransaction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] =
    useState<TransactionResult | null>(null);

  // Copy states
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validateAndParseTransaction = (input: string) => {
    try {
      setRawTransaction(input);
      setParsedTransaction(null);
      setIsValidTransaction(false);

      if (!input.trim()) {
        return;
      }

      let transactionData: RawTransactionData;

      // Try to parse as serialized transaction (hex string)
      if (isHex(input) && input.startsWith('0x')) {
        try {
          const parsed = parseTransaction(input as `0x${string}`);
          transactionData = {
            type: parsed.type,
            chainId: parsed.chainId ? Number(parsed.chainId) : undefined,
            from: parsed.from,
            to: parsed.to,
            value: parsed.value ? parsed.value.toString() : undefined,
            data: parsed.data,
            nonce: parsed.nonce ? Number(parsed.nonce) : undefined,
            gasLimit: parsed.gas ? parsed.gas.toString() : undefined,
            maxFeePerGas: parsed.maxFeePerGas
              ? parsed.maxFeePerGas.toString()
              : undefined,
            maxPriorityFeePerGas: parsed.maxPriorityFeePerGas
              ? parsed.maxPriorityFeePerGas.toString()
              : undefined,
          };
        } catch (error) {
          throw new Error('Invalid serialized transaction format');
        }
      } else {
        // Try to parse as JSON transaction object
        try {
          transactionData = JSON.parse(input);

          // Basic validation for required fields
          if (!transactionData.to && !transactionData.data) {
            throw new Error(
              'Transaction must have either "to" address or "data"',
            );
          }
        } catch (error) {
          throw new Error('Invalid JSON format or serialized transaction');
        }
      }

      setParsedTransaction(transactionData);
      setIsValidTransaction(true);

      toast({
        ...toastOptions,
        title: 'Transaction Parsed',
        description: 'Transaction format is valid and ready for submission',
        variant: 'default',
      });
    } catch (error: any) {
      setIsValidTransaction(false);
      toast({
        ...toastOptions,
        title: 'Invalid Transaction',
        description: error.message,
      });
    }
  };

  const submitTransaction = async () => {
    if (!parsedTransaction || !publicClient) {
      toast({
        ...toastOptions,
        title: 'Submission Failed',
        description: 'No valid transaction or wallet connected',
      });
      return;
    }

    setIsSubmitting(true);
    setTransactionResult(null);

    try {
      // Prepare transaction request
      const transactionRequest: TransactionRequest = {
        to: parsedTransaction.to as Address,
        value: parsedTransaction.value
          ? BigInt(parsedTransaction.value)
          : undefined,
        data: parsedTransaction.data as `0x${string}`,
        gas: parsedTransaction.gasLimit
          ? BigInt(parsedTransaction.gasLimit)
          : undefined,
        maxFeePerGas: parsedTransaction.maxFeePerGas
          ? BigInt(parsedTransaction.maxFeePerGas)
          : undefined,
        maxPriorityFeePerGas: parsedTransaction.maxPriorityFeePerGas
          ? BigInt(parsedTransaction.maxPriorityFeePerGas)
          : undefined,
        nonce: parsedTransaction.nonce,
      };

      // Submit transaction
      const hash = await walletClient.sendTransaction(transactionRequest);

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      setTransactionResult({
        hash,
        receipt,
      });

      toast({
        ...toastOptions,
        title: 'Transaction Submitted',
        description: `Transaction hash: ${hash.slice(0, 10)}...${hash.slice(
          -8,
        )}`,
        variant: 'default',
      });
    } catch (error: any) {
      setTransactionResult({
        hash: '0x' as Hash,
        error: error.message,
      });

      toast({
        ...toastOptions,
        title: 'Transaction Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAll = () => {
    setRawTransaction('');
    setParsedTransaction(null);
    setIsValidTransaction(false);
    setTransactionResult(null);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Raw Transaction Submitter</h2>
          <p className="text-sm text-gray-600 mt-1">
            Submit raw transactions directly using your connected wallet
          </p>
        </div>
      </div>

      {/* Transaction Input */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Raw Transaction Data</Label>
            <p className="text-xs text-gray-600 mt-1 mb-2">
              Paste either a serialized transaction (0x...) or JSON transaction
              object
            </p>
            <Textarea
              value={rawTransaction}
              onChange={(e) => validateAndParseTransaction(e.target.value)}
              placeholder={`Serialized transaction (0x...) or JSON object:
{
  "type": "0x2",
  "to": "0x...",
  "value": "1000000000000000000",
  "data": "0x",
  "gasLimit": "21000",
  "maxFeePerGas": "30000000000",
  "maxPriorityFeePerGas": "2000000000"
}`}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          {isValidTransaction && parsedTransaction && (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckIcon className="w-5 h-5 text-green-600" />
                <Label className="text-sm font-medium text-green-800">
                  Parsed Transaction
                </Label>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-slate-100 leading-relaxed">
                  <code className="language-json">
                    {JSON.stringify(parsedTransaction, null, 2)}
                  </code>
                </pre>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(parsedTransaction, null, 2),
                      'parsedTx',
                    )
                  }
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  {copiedStates.parsedTx ? (
                    <>
                      <CheckIcon className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3 h-3 mr-1" />
                      Copy Parsed
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Transaction */}
      {isValidTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={submitTransaction}
              disabled={isSubmitting || !isValidTransaction}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Transaction...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Submit Transaction
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction Result */}
      {transactionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {transactionResult.error ? (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              ) : (
                <CheckIcon className="w-5 h-5 text-green-600" />
              )}
              Transaction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border rounded-lg p-4 ${
                transactionResult.error
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              {transactionResult.error ? (
                <div>
                  <Label className="text-sm font-medium text-red-800 mb-2 block">
                    Transaction Failed
                  </Label>
                  <p className="text-sm text-red-700">
                    {transactionResult.error}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-green-800">
                      Transaction Hash
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs bg-green-100 p-2 rounded break-all font-mono">
                        {transactionResult.hash}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(transactionResult.hash, 'txHash')
                        }
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        {copiedStates.txHash ? (
                          <CheckIcon className="w-3 h-3" />
                        ) : (
                          <CopyIcon className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const explorerUrl =
                            chainId === 1
                              ? `https://etherscan.io/tx/${transactionResult.hash}`
                              : `https://sepolia.etherscan.io/tx/${transactionResult.hash}`;
                          window.open(explorerUrl, '_blank');
                        }}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {transactionResult.receipt && (
                    <div>
                      <Label className="text-sm font-medium text-green-800">
                        Transaction Receipt
                      </Label>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mt-2">
                        <pre className="text-sm text-slate-100 leading-relaxed">
                          <code className="language-json">
                            {JSON.stringify(
                              {
                                blockNumber:
                                  transactionResult.receipt.blockNumber?.toString(),
                                gasUsed:
                                  transactionResult.receipt.gasUsed?.toString(),
                                status: transactionResult.receipt.status,
                                effectiveGasPrice:
                                  transactionResult.receipt.effectiveGasPrice?.toString(),
                              },
                              null,
                              2,
                            )}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RawTransactionSubmitter;
