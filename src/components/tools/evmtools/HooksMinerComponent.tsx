import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';
import { Label } from '@shadcn-components/ui/label';
import { ethers } from 'ethers';
import {
  counterConstructArgEncoded,
  counterCreationCode,
  counterHookFlags,
  hooksMinerAddressBaseSepolia,
} from '@data/dummy-creation-code-v4-hooks';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Textarea } from '@shadcn-components/ui/textarea';
import InputBaseCopy from '@components/common/BaseInputCopy';
import BaseTextareaCopy from '@components/common/BaseTextareaCopy';
import { useEthersProvider } from '@hooks/useEthersSigner';
import { useToast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';

// ABI for the HookMiner contract
const hookMinerABI = [
  {
    inputs: [
      { name: 'deployer', type: 'address' },
      { name: 'flags', type: 'uint160' },
      { name: 'creationCode', type: 'bytes' },
      { name: 'constructorArgs', type: 'bytes' },
    ],
    name: 'find',
    outputs: [
      { name: 'hookAddress', type: 'address' },
      { name: 'salt', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'deployer', type: 'address' },
      { name: 'salt', type: 'uint256' },
      { name: 'creationCode', type: 'bytes' },
    ],
    name: 'computeAddress',
    outputs: [{ name: 'hookAddress', type: 'address' }],
    stateMutability: 'pure',
    type: 'function',
  },
];

const hooks = [
  { name: 'BEFORE_INITIALIZE', value: BigInt(1) << BigInt(13) },
  { name: 'AFTER_INITIALIZE', value: BigInt(1) << BigInt(12) },
  { name: 'BEFORE_ADD_LIQUIDITY', value: BigInt(1) << BigInt(11) },
  { name: 'AFTER_ADD_LIQUIDITY', value: BigInt(1) << BigInt(10) },
  { name: 'BEFORE_REMOVE_LIQUIDITY', value: BigInt(1) << BigInt(9) },
  { name: 'AFTER_REMOVE_LIQUIDITY', value: BigInt(1) << BigInt(8) },
  { name: 'BEFORE_SWAP', value: BigInt(1) << BigInt(7) },
  { name: 'AFTER_SWAP', value: BigInt(1) << BigInt(6) },
  { name: 'BEFORE_DONATE', value: BigInt(1) << BigInt(5) },
  { name: 'AFTER_DONATE', value: BigInt(1) << BigInt(4) },
  { name: 'BEFORE_SWAP_RETURNS_DELTA', value: BigInt(1) << BigInt(3) },
  { name: 'AFTER_SWAP_RETURNS_DELTA', value: BigInt(1) << BigInt(2) },
  { name: 'AFTER_ADD_LIQUIDITY_RETURNS_DELTA', value: BigInt(1) << BigInt(1) },
  {
    name: 'AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA',
    value: BigInt(1) << BigInt(0),
  },
];

const HookMinerComponent: React.FC = () => {
  const [flags, setFlags] = useState<string>(counterHookFlags.toString());
  const [creationCode, setCreationCode] = useState<string>(counterCreationCode);
  const [loading, setLoading] = useState<boolean>(false);
  const [constructorArgs, setConstructorArgs] = useState<string>(
    counterConstructArgEncoded,
  );
  // base sepolia
  const ethersProvider = useEthersProvider({ chainId: 84532 });
  const [result, setResult] = useState<{
    hookAddress: string;
    salt: string;
  } | null>(null);
  const [selectedHooks, setSelectedHooks] = useState<string[]>([]);
  const [computeSalt, setComputeSalt] = useState<string>('');
  const [findSaltResult, setFindSaltResult] = useState<{}>({});
  const [deployerAddress, setDeployerAddress] = useState<string>(
    '0xe15118c8eC7043aE07bcB6362E531921c7c7c519',
  );
  const [computeResult, setComputeResult] = useState<string | null>(null);
  const { toast } = useToast();
  // const {
  //   data: findSaltResult,
  //   isError: findSaltErr,
  //   isLoading: findSaltLoading,
  //   refetch: refetchFindSalt,
  // } = useReadContract({
  //   address: '0x3765cc3fd6F1Fe1E18180BEfdC0c412531d1c097',
  //   abi: hookMinerABI,
  //   functionName: 'find',
  //   args: flags
  //     ? [
  //         deployerAddress,
  //         ethers.BigNumber.from(flags),
  //         creationCode,
  //         constructorArgs,
  //       ]
  //     : undefined,
  //   query: { enabled: false },
  // });

  const {
    data: computeAddressResult,
    isError: computeAddressErr,
    isLoading: computeAddressLoading,
    refetch: refetchComputeAddress,
  } = useReadContract({
    address: '0x3765cc3fd6F1Fe1E18180BEfdC0c412531d1c097',
    abi: hookMinerABI,
    functionName: 'computeAddress',
    args: computeSalt
      ? [deployerAddress, ethers.BigNumber.from(computeSalt), creationCode]
      : undefined,
    query: { enabled: false },
  });

  useEffect(() => {
    if (findSaltResult && Object.keys(findSaltResult).length !== 0) {
      setResult({
        // @ts-ignore
        hookAddress: findSaltResult[0],
        // @ts-ignore
        salt: findSaltResult[1],
      });
    }
  }, [findSaltResult]);

  useEffect(() => {
    if (computeAddressResult) {
      setComputeResult(computeAddressResult as string);
    }
  }, [computeAddressResult]);

  useEffect(() => {
    const calculatedFlags = selectedHooks.reduce((acc, hookName) => {
      const hook = hooks.find((h) => h.name === hookName);
      return hook ? acc | hook.value : acc;
    }, BigInt(0));
    setFlags(calculatedFlags.toString());
  }, [selectedHooks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // refetchFindSalt();
    setLoading(true);
    try {
      const contractInstance = new ethers.Contract(
        hooksMinerAddressBaseSepolia,
        hookMinerABI,
        ethersProvider,
      );

      const findSaltResult = await contractInstance.find(
        deployerAddress,
        ethers.BigNumber.from(flags),
        creationCode,
        constructorArgs,
      );
      setFindSaltResult(findSaltResult);
    } catch (e) {
      toast({ ...toastOptions, title: (e as Error).message });
    }
    setLoading(false);
  };

  // const handleComputeSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   refetchComputeAddress();
  // };

  const handleHookToggle = (hookName: string) => {
    setSelectedHooks((prev) =>
      prev.includes(hookName)
        ? prev.filter((h) => h !== hookName)
        : [...prev, hookName],
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[480px] w-[100%] mb-8">
        <Card>
          <CardHeader>
            <CardTitle>HookMiner</CardTitle>
            <CardDescription>Find a salt for your hook address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Select Hooks</Label>
                {hooks.map((hook) => (
                  <div
                    key={hook.name}
                    className="flex flex-row content-center space-x-2"
                  >
                    <Checkbox
                      id={hook.name}
                      checked={selectedHooks.includes(hook.name)}
                      onCheckedChange={() => handleHookToggle(hook.name)}
                    />
                    <Label htmlFor={hook.name}>{hook.name}</Label>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="flags">Flags (calculated)</Label>
                <Input
                  id="flags"
                  value={flags}
                  readOnly
                  placeholder="Calculated flags"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="constructorArgs">Deployer Address</Label>
                <Input
                  id="constructorArgs"
                  value={deployerAddress}
                  onChange={(e) => setDeployerAddress(e.target.value)}
                  placeholder="Enter deployer address"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="creationCode">
                  Hook Contract Creation Code
                </Label>
                <Textarea
                  id="creationCode"
                  value={creationCode}
                  onChange={(e) => setCreationCode(e.target.value)}
                  placeholder="Enter creation code"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="constructorArgs">
                  Constructor Arguments (encoded)
                </Label>
                <Input
                  id="constructorArgs"
                  value={constructorArgs}
                  onChange={(e) => setConstructorArgs(e.target.value)}
                  placeholder="Enter abi encoded constructor arguments"
                />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleSubmit}>
              {loading ? 'Finding salt.....' : 'Find Salt'}
            </Button>
          </CardContent>
          <CardFooter>
            {result && (
              <div className="w-full">
                <p>Hook Address: </p>
                <InputBaseCopy value={result.hookAddress} disabled />
                <p>Salt: </p>
                <BaseTextareaCopy value={result.salt} disabled />
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
      {/* <div className="max-w-[480px] w-[100%]">
        <Card>
          <CardHeader>
            <CardTitle>Compute Hook Address</CardTitle>
            <CardDescription>Compute hook address from salt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="computeSalt">Salt</Label>
                <Input
                  id="computeSalt"
                  value={computeSalt}
                  onChange={(e) => setComputeSalt(e.target.value)}
                  placeholder="Enter salt"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4"
              onClick={handleComputeSubmit}
            >
              Compute Address
            </Button>
          </CardContent>
          <CardFooter>
            {computeResult && (
              <div>
                <p>Computed Hook Address: {computeResult}</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div> */}
    </div>
  );
};

export default HookMinerComponent;
