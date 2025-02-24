import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';

import { RadioGroup, RadioGroupItem } from '@shadcn-components/ui/radio-group'; // Assuming shadcn-ui has this
import { Label } from '@shadcn-components/ui/label';
import { useEthersProvider } from '@hooks/useEthersSigner';
import { useChainId } from 'wagmi';

const ENSResolverTool: React.FC = () => {
  const chainId = useChainId();
  let provider = useEthersProvider({ chainId: chainId });
  const [inputValue, setInputValue] = useState<string>('');
  const [resolvedResult, setResolvedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');

  // Initialize ethers provider
  // const provider = ethers.getDefaultProvider('mainnet'); // Replace with your provider if needed

  const handleResolve = async () => {
    if (!inputValue) {
      setError('Please enter a value.');
      return;
    }

    if (!provider) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setResolvedResult(null);

    try {
      if (mode === 'forward') {
        // Forward resolution: ENS name to address
        const address = await provider.resolveName(inputValue);
        if (address) {
          setResolvedResult(address);
        } else {
          setError('No address found for this ENS name.');
        }
      } else {
        // Reverse resolution: Address to ENS name
        if (!ethers.isAddress(inputValue)) {
          setError('Invalid Ethereum address.');
          setIsLoading(false);
          return;
        }
        const name = await provider.lookupAddress(inputValue);
        if (name) {
          setResolvedResult(name);
        } else {
          setError('No ENS name found for this address.');
        }
      }
    } catch (err) {
      setError(
        `Failed to resolve ${
          mode === 'forward' ? 'ENS name' : 'address'
        }. Check the input or connect to appropriate network.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ENS Resolver Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <RadioGroup
          value={mode}
          onValueChange={(value: 'forward' | 'reverse') => {
            setMode(value);
            setInputValue('');
            setResolvedResult(null);
            setError(null);
          }}
          className="flex space-x-4 justify-middle "
        >
          <div className="flex-row space-x-2 align-middle items-center">
            <RadioGroupItem value="forward" id="forward" />
            <Label htmlFor="forward">Name to Address</Label>
          </div>
          <div className="flex-row space-x-2 align-middle items-center">
            <RadioGroupItem value="reverse" id="reverse" />
            <Label htmlFor="reverse">Address to Name</Label>
          </div>
        </RadioGroup>

        {/* Input and Button */}
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder={
              mode === 'forward'
                ? 'Enter ENS name (e.g., vitalik.eth)'
                : 'Enter Ethereum address (e.g., 0x...)'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.trim())}
            disabled={isLoading}
            className="w-full"
          />
          <Button
            onClick={handleResolve}
            disabled={isLoading || !inputValue}
            className="w-full"
          >
            {isLoading ? <>Resolving...</> : 'Resolve'}
          </Button>
        </div>

        {/* Result Display */}
        {resolvedResult && (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-medium">
              Resolved {mode === 'forward' ? 'Address' : 'ENS Name'}:
            </p>
            <p className="text-sm break-all">{resolvedResult}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ENSResolverTool;
