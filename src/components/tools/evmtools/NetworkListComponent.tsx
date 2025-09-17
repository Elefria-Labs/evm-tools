import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Network, NetworkFilters } from './NetworkList/types';
import NetworkCard from './NetworkList/NetworkCard';
import networkData from '@data/networkList.json';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function NetworkListComponent() {
  const [networks] = useState<Network[]>(networkData as Network[]);
  const [filters, setFilters] = useState<NetworkFilters>({
    searchQuery: '',
    networkType: 'all',
    hasExplorers: false,
    hasFaucets: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const { filteredNetworks, totalFilteredCount } = useMemo(() => {
    let filtered = networks;

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (network) =>
          network.name.toLowerCase().includes(query) ||
          network.chain.toLowerCase().includes(query) ||
          network.shortName?.toLowerCase().includes(query) ||
          network.nativeCurrency.symbol.toLowerCase().includes(query) ||
          network.chainId.toString().includes(query),
      );
    }

    // Network type filter
    if (filters.networkType !== 'all') {
      filtered = filtered.filter((network) => {
        const isTestnet =
          network.name.toLowerCase().includes('test') ||
          network.chain.toLowerCase().includes('test') ||
          network.shortName?.toLowerCase().includes('test');
        return filters.networkType === 'testnet' ? isTestnet : !isTestnet;
      });
    }

    // Explorers filter
    if (filters.hasExplorers) {
      filtered = filtered.filter(
        (network) => network.explorers && network.explorers.length > 0,
      );
    }

    // Faucets filter
    if (filters.hasFaucets) {
      filtered = filtered.filter(
        (network) => network.faucets && network.faucets.length > 0,
      );
    }

    // Sort by chain ID for consistent ordering
    const sorted = filtered.sort((a, b) => a.chainId - b.chainId);
    const totalCount = sorted.length;

    // Limit to 50 items by default unless showAll is true
    const displayedNetworks = showAll ? sorted : sorted.slice(0, 50);

    return {
      filteredNetworks: displayedNetworks,
      totalFilteredCount: totalCount,
    };
  }, [networks, filters, showAll]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      networkType: 'all',
      hasExplorers: false,
      hasFaucets: false,
    });
  };

  const updateFilter = (key: keyof NetworkFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const networkStats = useMemo(() => {
    const mainnetCount = networks.filter((n) => {
      const isTestnet =
        n.name.toLowerCase().includes('test') ||
        n.chain.toLowerCase().includes('test') ||
        n.shortName?.toLowerCase().includes('test');
      return !isTestnet;
    }).length;

    const testnetCount = networks.length - mainnetCount;
    const withExplorers = networks.filter(
      (n) => n.explorers && n.explorers.length > 0,
    ).length;
    const withFaucets = networks.filter(
      (n) => n.faucets && n.faucets.length > 0,
    ).length;

    return { mainnetCount, testnetCount, withExplorers, withFaucets };
  }, [networks]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-200 dark:bg-slate-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Network List</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discover and connect to EVM-compatible networks
        </p>

        {/* Stats */}
        {/* <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{networks.length} Total Networks</Badge>
          <Badge variant="default">{networkStats.mainnetCount} Mainnets</Badge>
          <Badge variant="destructive">
            {networkStats.testnetCount} Testnets
          </Badge>
          <Badge variant="secondary">
            {networkStats.withExplorers} With Explorers
          </Badge>
          {networkStats.withFaucets > 0 && (
            <Badge variant="secondary">
              {networkStats.withFaucets} With Faucets
            </Badge>
          )}
        </div> */}
      </div>

      {/* Filters */}
      <div className="space-y-4 p-4  rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, chain ID, or symbol..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filters.networkType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('networkType', 'all')}
            >
              All Networks
            </Button>
            <Button
              variant={
                filters.networkType === 'mainnet' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => updateFilter('networkType', 'mainnet')}
            >
              Mainnet Only
            </Button>
            <Button
              variant={
                filters.networkType === 'testnet' ? 'destructive' : 'outline'
              }
              size="sm"
              onClick={() => updateFilter('networkType', 'testnet')}
            >
              Testnet Only
            </Button>
          </div>
        </div>

        {/* <div className="flex gap-2 flex-wrap">
          <Button
            variant={filters.hasExplorers ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('hasExplorers', !filters.hasExplorers)}
          >
            Has Block Explorer
          </Button>
          <Button
            variant={filters.hasFaucets ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('hasFaucets', !filters.hasFaucets)}
          >
            Has Faucets
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="ml-auto"
          >
            <ResetIcon className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div> */}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {totalFilteredCount === networks.length
              ? `All Networks (${
                  showAll
                    ? totalFilteredCount
                    : Math.min(50, totalFilteredCount)
                } of ${totalFilteredCount})`
              : `Filtered Results (${
                  showAll
                    ? totalFilteredCount
                    : Math.min(50, totalFilteredCount)
                } of ${totalFilteredCount})`}
          </h2>
        </div>

        {filteredNetworks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg mb-2">No networks found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNetworks.map((network) => (
                <NetworkCard
                  key={`${network.chainId}-${network.name}`}
                  network={network}
                />
              ))}
            </div>

            {/* Load More Button */}
            {!showAll && totalFilteredCount > 50 && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  className="px-6"
                >
                  Load All {totalFilteredCount - 50} More Networks
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-xs text-slate-500 text-center py-4 border-t">
        Data sourced from chainlist.org • Click &quot;Add to MetaMask&quot; to
        quickly add networks
      </div>
    </div>
  );
}
