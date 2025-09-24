import React, { useState } from 'react';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn-components/ui/select';
import { useToast } from '@shadcn-components/ui/use-toast';
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { toastOptions } from '@components/common/toast';
import { createPublicClient, http, isHex, Address, PublicClient } from 'viem';
import {
  POSITION_MANAGER_ABI,
  V4_POSITION_MANAGER_CHAIN_CONFIGS,
  ChainConfig,
} from './PoolId/utils';
import InputBaseCopy from '@components/common/BaseInputCopy';

interface PoolKey {
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
  hooks: Address;
}

interface TokenMetadata {
  name?: string;
  symbol?: string;
  decimals?: number;
}

const V4PoolIdToPoolKey: React.FC = () => {
  const { toast } = useToast();

  // Component state
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [poolId, setPoolId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PoolKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [tokenMetadata, setTokenMetadata] = useState<{
    currency0?: TokenMetadata;
    currency1?: TokenMetadata;
  }>({});

  // Copy functionality
  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
      toast({
        ...toastOptions,
        title: 'Copied',
        description: 'Address copied to clipboard',
        variant: 'default',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Validate Pool ID format
  const validatePoolId = (id: string): boolean => {
    if (!id) return false;
    // Check if it's a valid hex string with 32 bytes (66 chars including 0x)
    if (!isHex(id)) return false;
    if (id.length !== 66) return false;
    return true;
  };

  // Convert bytes32 Pool ID to bytes25 format (equivalent to Solidity bytes25 conversion)
  const convertToBytes25 = (poolId: string): `0x${string}` => {
    if (!isHex(poolId) || poolId.length !== 66) {
      throw new Error('Invalid Pool ID format');
    }
    // Remove the last 7 bytes (14 hex characters) to convert from bytes32 to bytes25
    // bytes25 = 25 bytes = 50 hex chars + '0x' = 52 total chars
    return poolId.slice(0, 52) as `0x${string}`;
  };

  // Create public client for selected chain
  const createClient = (chain: ChainConfig): PublicClient => {
    return createPublicClient({
      chain: chain.chain,
      transport: http(),
    });
  };

  // Fetch token metadata
  const fetchTokenMetadata = async (
    client: PublicClient,
    tokenAddress: Address,
  ): Promise<TokenMetadata> => {
    try {
      const [name, symbol, decimals] = await Promise.allSettled([
        client.readContract({
          address: tokenAddress,
          abi: [
            {
              inputs: [],
              name: 'name',
              outputs: [{ name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'name',
        }),
        client.readContract({
          address: tokenAddress,
          abi: [
            {
              inputs: [],
              name: 'symbol',
              outputs: [{ name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'symbol',
        }),
        client.readContract({
          address: tokenAddress,
          abi: [
            {
              inputs: [],
              name: 'decimals',
              outputs: [{ name: '', type: 'uint8' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'decimals',
        }),
      ]);

      return {
        name: name.status === 'fulfilled' ? (name.value as string) : undefined,
        symbol:
          symbol.status === 'fulfilled' ? (symbol.value as string) : undefined,
        decimals:
          decimals.status === 'fulfilled'
            ? (decimals.value as number)
            : undefined,
      };
    } catch (error) {
      return {};
    }
  };

  // Query poolKeys function
  const queryPoolKeys = async () => {
    if (!selectedChain) {
      toast({
        ...toastOptions,
        title: 'Chain Required',
        description: 'Please select a chain first',
      });
      return;
    }

    if (!validatePoolId(poolId)) {
      setError(
        'Invalid Pool ID format. Must be a 32-byte hex string (66 characters including 0x)',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setTokenMetadata({});

    try {
      const client = createClient(selectedChain);

      // Convert Pool ID from bytes32 to bytes25 format
      const bytes25PoolId = convertToBytes25(poolId);

      // Call poolKeys function with bytes25 Pool ID
      const poolKey = (await client.readContract({
        address: selectedChain.positionManager,
        abi: POSITION_MANAGER_ABI,
        functionName: 'poolKeys',
        args: [bytes25PoolId],
      })) as PoolKey;

      setResult(poolKey);

      // Fetch token metadata in background
      if (poolKey.currency0 !== '0x0000000000000000000000000000000000000000') {
        fetchTokenMetadata(client, poolKey.currency0).then((metadata) => {
          setTokenMetadata((prev) => ({ ...prev, currency0: metadata }));
        });
      }

      if (poolKey.currency1 !== '0x0000000000000000000000000000000000000000') {
        fetchTokenMetadata(client, poolKey.currency1).then((metadata) => {
          setTokenMetadata((prev) => ({ ...prev, currency1: metadata }));
        });
      }

      toast({
        ...toastOptions,
        title: 'Success',
        description: 'Pool key retrieved successfully',
        variant: 'default',
      });
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to query pool keys';

      // Handle specific conversion errors
      if (error.message?.includes('Invalid Pool ID format')) {
        errorMessage = 'Invalid Pool ID format for bytes25 conversion';
      }

      setError(errorMessage);
      toast({
        ...toastOptions,
        title: 'Query Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format fee as percentage
  const formatFeePercentage = (fee: number): string => {
    return `${(fee / 10000).toFixed(2)}%`;
  };

  return (
    <div className="space-y-4 p-2 sm:p-4 max-w-full overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <Card className="w-full min-w-0">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">
              Query Pool Key details from Pool ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6">
            <div>
              <Label>Chain</Label>
              <Select
                value={selectedChain?.chainId.toString()}
                onValueChange={(value) => {
                  const chain = V4_POSITION_MANAGER_CHAIN_CONFIGS.find(
                    (c) => c.chainId.toString() === value,
                  );
                  setSelectedChain(chain || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a chain" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 text-xs font-medium text-gray-500">
                    Mainnets
                  </div>
                  {V4_POSITION_MANAGER_CHAIN_CONFIGS.filter(
                    (c) => !c.isTestnet,
                  ).map((chain) => (
                    <SelectItem
                      key={chain.chainId}
                      value={chain.chainId.toString()}
                    >
                      {chain.name}
                    </SelectItem>
                  ))}
                  <div className="p-2 text-xs font-medium text-gray-500 border-t">
                    Testnets
                  </div>
                  {V4_POSITION_MANAGER_CHAIN_CONFIGS.filter(
                    (c) => c.isTestnet,
                  ).map((chain) => (
                    <SelectItem
                      key={chain.chainId}
                      value={chain.chainId.toString()}
                    >
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pool ID (bytes32)</Label>
              <Input
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
              {poolId && !validatePoolId(poolId) && (
                <p className="text-sm text-red-500 mt-1">
                  Invalid format. Pool ID must be a 32-byte hex string.
                </p>
              )}
            </div>

            <Button
              onClick={queryPoolKeys}
              disabled={!selectedChain || !validatePoolId(poolId) || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                  Querying...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                  Query Pool Key
                </>
              )}
            </Button>

            {error && (
              <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="w-full min-w-0">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">
              Pool Key Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {result ? (
              <div className="space-y-4">
                {/* Currency 0 */}
                <div>
                  <Label>Currency 0</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <InputBaseCopy value={result.currency0 ?? ''} disabled />
                    {/* <code className="flex-1 text-xs p-2 rounded break-all min-w-0 ">
                      {result.currency0}
                    </code> */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `${selectedChain?.blockExplorer}/address/${result.currency0}`,
                            '_blank',
                          )
                        }
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {tokenMetadata.currency0 && (
                    <div className="text-xs text-gray-600 mt-1 break-words">
                      {tokenMetadata.currency0.name} (
                      {tokenMetadata.currency0.symbol})
                      {tokenMetadata.currency0.decimals &&
                        ` - ${tokenMetadata.currency0.decimals} decimals`}
                    </div>
                  )}
                </div>

                {/* Currency 1 */}
                <div>
                  <Label>Currency 1</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <InputBaseCopy value={result.currency1 ?? ''} disabled />
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `${selectedChain?.blockExplorer}/address/${result.currency1}`,
                            '_blank',
                          )
                        }
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {tokenMetadata.currency1 && (
                    <div className="text-xs text-gray-600 mt-1 break-words">
                      {tokenMetadata.currency1.name} (
                      {tokenMetadata.currency1.symbol})
                      {tokenMetadata.currency1.decimals &&
                        ` - ${tokenMetadata.currency1.decimals} decimals`}
                    </div>
                  )}
                </div>

                {/* Fee */}
                <div>
                  <Label>Fee</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <InputBaseCopy
                      value={`${result.fee} ${formatFeePercentage(result.fee)}`}
                      disabled
                    />
                  </div>
                </div>

                {/* Tick Spacing */}
                <div>
                  <Label>Tick Spacing</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <InputBaseCopy
                      value={result.tickSpacing.toString()}
                      disabled
                    />
                  </div>
                </div>

                {/* Hooks */}
                <div>
                  <Label>Hooks Contract</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <InputBaseCopy value={result.hooks} disabled />

                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `${selectedChain?.blockExplorer}/address/${result.hooks}`,
                            '_blank',
                          )
                        }
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {result.hooks ===
                    '0x0000000000000000000000000000000000000000' && (
                    <div className="text-xs text-gray-600 mt-1 break-words">
                      No hooks attached to this pool
                    </div>
                  )}
                </div>

                {/* Solidity Struct Format */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">
                      Solidity Struct Format
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const structCode = `struct PoolKey {
    Currency currency0; // ${result.currency0}
    Currency currency1; // ${result.currency1}
    uint24 fee;         // ${result.fee}
    int24 tickSpacing;  // ${result.tickSpacing}
    IHooks hooks;       // ${result.hooks}
}`;
                        handleCopy(structCode, 'struct');
                      }}
                    >
                      {copiedStates.struct ? (
                        <CheckIcon className="w-3 h-3" />
                      ) : (
                        <CopyIcon className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap break-all">
                      {`struct PoolKey {
    Currency currency0; // ${result.currency0}
    Currency currency1; // ${result.currency1}
    uint24 fee;         // ${result.fee}
    int24 tickSpacing;  // ${result.tickSpacing}
    IHooks hooks;       // ${result.hooks}
}`}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a Pool ID and select a chain to query pool details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default V4PoolIdToPoolKey;
