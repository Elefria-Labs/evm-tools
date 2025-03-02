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

const TEXT_KEYS = [
  'email',
  'url',
  'description',
  'com.twitter',
  'com.github',
  'vnd.github',
];

const ENSRecordInspector: React.FC = () => {
  const [ensName, setEnsName] = useState<string>('');
  const [records, setRecords] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inspectRecords = async () => {
    if (!ensName) {
      setError('Please enter an ENS name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecords(null);

    try {
      const provider = ethers.getDefaultProvider('mainnet');

      const node = ethers.namehash(ensName);

      const resolver = await provider.getResolver(ensName);

      if (!resolver) {
        setError('No resolver found for this ENS name.');
        setIsLoading(false);
        return;
      }

      const address = await resolver.getAddress();

      const result: any = {
        ensName,
        resolver: resolver.address,
        address: address || null,
        textRecords: {},
      };

      try {
        const contentHashBytes = await resolver.getContentHash();
        if (contentHashBytes) {
          result.contentHash = contentHashBytes;
        }
      } catch (err) {
        // Content hash might not be available
      }

      for (const key of TEXT_KEYS) {
        try {
          const value = await resolver.getText(key);
          if (value) result.textRecords[key] = value;
        } catch (err) {
          // Ignore missing text records
        }
      }

      if (Object.keys(result.textRecords).length === 0) {
        result.textRecords = null;
      }

      setRecords(result);
    } catch (err) {
      console.error('ENS lookup error:', err);
      setError(
        'Failed to fetch ENS records. Check the name or network status.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>ENS Record Inspector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="Enter ENS name (e.g., vitalik.eth)"
            value={ensName}
            onChange={(e) => setEnsName(e.target.value.trim())}
            disabled={isLoading}
            className="w-full"
          />
          <Button
            onClick={inspectRecords}
            disabled={isLoading || !ensName}
            className="w-full"
          >
            {isLoading ? 'Inspecting...' : 'Inspect'}
          </Button>
        </div>

        {records && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md space-y-2">
            <p className="text-sm font-medium">ENS Name:</p>
            <p className="text-sm">{records.ensName}</p>
            <p className="text-sm font-medium">Resolver:</p>
            <p className="text-sm break-all">{records.resolver}</p>
            {records.address && (
              <>
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm break-all">{records.address}</p>
              </>
            )}
            {records.contentHash && (
              <>
                <p className="text-sm font-medium">Content Hash:</p>
                <p className="text-sm break-all">{records.contentHash}</p>
              </>
            )}
            {records.textRecords && (
              <>
                <p className="text-sm font-medium">Text Records:</p>
                <div className="text-sm space-y-1">
                  {Object.entries(records.textRecords).map(([key, value]) => (
                    <p key={key}>
                      {key}: {value as string}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ENSRecordInspector;
