'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UpdateIcon } from '@radix-ui/react-icons';

interface GasPriceData {
  gasPrice: string;
  timestamp: number;
}

export default function GasPrice() {
  const [gasData, setGasData] = useState<GasPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchGasPrice = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using multiple RPC endpoints for reliability
      const rpcUrls = [
        'https://ethereum.publicnode.com',
        'https://rpc.ankr.com/eth',
        'https://eth.llamarpc.com',
        'https://ethereum.blockpi.network/v1/rpc/public',
      ];

      let provider: ethers.JsonRpcProvider | null = null;
      let gasPrice: bigint | null = null;

      // Try different RPC endpoints until one works
      for (const rpcUrl of rpcUrls) {
        try {
          provider = new ethers.JsonRpcProvider(rpcUrl);
          gasPrice = await provider.getFeeData().then((data) => data.gasPrice);
          if (gasPrice) break;
        } catch (err) {
          console.warn(`Failed to fetch from ${rpcUrl}:`, err);
          continue;
        }
      }

      if (!gasPrice) {
        throw new Error('Failed to fetch gas price from all RPC endpoints');
      }

      // Convert to Gwei
      const gasPriceInGwei = ethers.formatUnits(gasPrice, 'gwei');
      const timestamp = Date.now();

      setGasData({
        gasPrice: parseFloat(gasPriceInGwei).toFixed(1),
        timestamp,
      });

      // Update last updated time
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    } catch (err) {
      console.error('Gas price fetch error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch gas price',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchGasPrice();

    // Set up interval for 4 minutes (240000ms)
    const interval = setInterval(fetchGasPrice, 4 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchGasPrice();
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-700/30 rounded-lg">
        {/* <ActivityLogIcon className="h-4 w-4 text-red-400" /> */}
        <span className="text-xs text-red-400">Gas: Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300">
            Gas:{' '}
            {gasData
              ? `${gasData.gasPrice} gwei`
              : loading
              ? 'Loading...'
              : 'N/A'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
            title="Refresh gas price"
          >
            <UpdateIcon
              className={`h-3 w-3 text-slate-400 ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
