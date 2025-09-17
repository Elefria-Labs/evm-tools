import React, { useState, useEffect } from 'react';
import { Button } from '@shadcn-components/ui/button';
import {
  CopyIcon,
  CheckIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { useToast } from '@shadcn-components/ui/use-toast';
import { NetworkRpc } from './types';

interface RPCHealthData {
  url: string;
  height?: number;
  latency?: number;
  score: 'success' | 'warning' | 'error' | 'loading';
  privacy: 'good' | 'bad' | 'unknown';
  error?: string;
}

interface RPCListProps {
  rpcs: NetworkRpc[];
  chainId: number;
}

// Privacy-focused RPC providers (simplified list)
const PRIVACY_GOOD_PROVIDERS = [
  'llamarpc.com',
  'publicnode.com',
  'flashbots.net',
  'blastapi.io',
  'ankr.com',
];

const PRIVACY_BAD_PROVIDERS = [
  'infura.io',
  'alchemy.com',
  'moralis.io',
  'quicknode.com',
];

export default function RPCList({ rpcs, chainId }: RPCListProps) {
  const [rpcHealth, setRpcHealth] = useState<RPCHealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedRpc, setCopiedRpc] = useState<string | null>(null);
  const { toast } = useToast();

  const getPrivacyRating = (url: string): 'good' | 'bad' | 'unknown' => {
    const domain = new URL(url).hostname;

    if (PRIVACY_GOOD_PROVIDERS.some((provider) => domain.includes(provider))) {
      return 'good';
    }

    if (PRIVACY_BAD_PROVIDERS.some((provider) => domain.includes(provider))) {
      return 'bad';
    }

    return 'unknown';
  };

  const testRPCHealth = async (rpc: NetworkRpc): Promise<RPCHealthData> => {
    const startTime = performance.now();
    let endTime: number;

    try {
      const response = await fetch(rpc.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        return {
          url: rpc.url,
          latency,
          score: 'error',
          privacy: getPrivacyRating(rpc.url),
          error: `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      endTime = performance.now(); // Measure after JSON parsing
      const latency = Math.round(endTime - startTime);

      if (data.error) {
        return {
          url: rpc.url,
          latency,
          score: 'error',
          privacy: getPrivacyRating(rpc.url),
          error: data.error.message,
        };
      }

      const blockHeight = parseInt(data.result, 16);

      // Determine score based on latency
      let score: 'success' | 'warning' | 'error' = 'success';
      if (latency > 3000) {
        score = 'error';
      } else if (latency > 1500) {
        score = 'warning';
      }

      return {
        url: rpc.url,
        height: blockHeight,
        latency,
        score,
        privacy: getPrivacyRating(rpc.url),
      };
    } catch (error) {
      endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      // For timeout errors, the latency should reflect the actual timeout duration
      const finalLatency =
        error instanceof Error && error.name === 'TimeoutError'
          ? 5000
          : latency;

      return {
        url: rpc.url,
        latency: finalLatency,
        score: 'error',
        privacy: getPrivacyRating(rpc.url),
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  };

  const testAllRPCs = async () => {
    setIsLoading(true);

    // Filter to working RPCs and limit to first 10 for performance
    const workingRpcs = rpcs
      .filter(
        (rpc) => rpc.url.startsWith('https://') || rpc.url.startsWith('wss://'),
      )
      .slice(0, 10);

    // Initialize with loading state
    const initialHealth: RPCHealthData[] = workingRpcs.map((rpc) => ({
      url: rpc.url,
      score: 'loading' as const,
      privacy: getPrivacyRating(rpc.url),
    }));

    setRpcHealth(initialHealth);

    // Test all RPCs concurrently
    const healthPromises = workingRpcs.map(testRPCHealth);
    const results = await Promise.all(healthPromises);

    setRpcHealth(results);
    setIsLoading(false);
  };

  useEffect(() => {
    testAllRPCs();
  }, [rpcs, chainId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRpc(text);
      toast({
        title: 'RPC URL copied to clipboard',
        duration: 2000,
      });
      setTimeout(() => setCopiedRpc(null), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        variant: 'destructive',
      });
    }
  };

  const getScoreIcon = (score: RPCHealthData['score']) => {
    switch (score) {
      case 'success':
        return <CheckCircledIcon className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <CrossCircledIcon className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <ReloadIcon className="h-4 w-4 text-slate-400 animate-spin" />;
      default:
        return null;
    }
  };

  const getPrivacyIcon = (privacy: RPCHealthData['privacy']) => {
    switch (privacy) {
      case 'good':
        return <CheckCircledIcon className="h-4 w-4 text-green-500" />;
      case 'bad':
        return <CrossCircledIcon className="h-4 w-4 text-red-500" />;
      case 'unknown':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatLatency = (latency?: number) => {
    if (!latency) return '-';
    if (latency < 1000) return `${latency}ms`;

    // Format like chainlist.org: "0.95s", "1.26s" (2 decimal places, but remove trailing zeros)
    const seconds = latency / 1000;
    return `${seconds.toFixed(2).replace(/\.?0+$/, '')}s`;
  };

  if (rpcHealth.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">No working RPC endpoints found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">RPC Endpoints</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={testAllRPCs}
          disabled={isLoading}
          className="text-xs"
        >
          <ReloadIcon
            className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b grid grid-cols-12 gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="col-span-5">RPC Server Address</div>
          <div className="col-span-2 text-center">Height</div>
          <div className="col-span-1 text-center">Latency</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-1 text-center">Privacy</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {/* RPC Rows */}
        <div className="divide-y">
          {rpcHealth.map((rpc, index) => (
            <div
              key={index}
              className="px-4 py-3 grid grid-cols-12 gap-2 items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              {/* URL */}
              <div className="col-span-5 font-mono text-xs break-all">
                {rpc.url.length > 50
                  ? `${rpc.url.substring(0, 47)}...`
                  : rpc.url}
              </div>

              {/* Height */}
              <div className="col-span-2 text-center">{rpc.height || '-'}</div>

              {/* Latency */}
              <div className="col-span-1 text-center">
                {formatLatency(rpc.latency)}
              </div>

              {/* Score */}
              <div className="col-span-1 flex justify-center">
                {getScoreIcon(rpc.score)}
              </div>

              {/* Privacy */}
              <div className="col-span-1 flex justify-center">
                {getPrivacyIcon(rpc.privacy)}
              </div>

              {/* Action */}
              <div className="col-span-2 flex justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(rpc.url)}
                  className="h-7 px-2 text-xs"
                  title="Copy RPC URL"
                >
                  {copiedRpc === rpc.url ? (
                    <CheckIcon className="h-3 w-3 text-green-500" />
                  ) : (
                    <CopyIcon className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
          Legend:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-3 w-3 text-green-500" />
              <span>Working / Good Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-3 w-3 text-yellow-500" />
              <span>Slow / Unknown Privacy</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CrossCircledIcon className="h-3 w-3 text-red-500" />
              <span>Failed / Poor Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <ReloadIcon className="h-3 w-3 text-slate-400" />
              <span>Testing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
