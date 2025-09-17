import React, { useState } from 'react';
import { Network } from './types';
import { Button } from '@shadcn-components/ui/button';
import { Badge } from '@shadcn-components/ui/badge';
import { Card, CardContent } from '@shadcn-components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shadcn-components/ui/dialog';
import { ExternalLinkIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useToast } from '@shadcn-components/ui/use-toast';
import RPCList from './RPCList';

interface NetworkCardProps {
  network: Network;
}

export default function NetworkCard({ network }: NetworkCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const isTestnet =
    network.name.toLowerCase().includes('test') ||
    network.chain.toLowerCase().includes('test') ||
    network.shortName.toLowerCase().includes('test');

  const addToMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not detected',
        description: 'Please install MetaMask to add this network',
        variant: 'destructive',
      });
      return;
    }

    const primaryRpc =
      network.rpc.find((rpc) => rpc.url.startsWith('https://'))?.url ||
      network.rpc[0]?.url;

    if (!primaryRpc) {
      toast({
        title: 'No RPC URL available',
        variant: 'destructive',
      });
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: {
              name: network.nativeCurrency.name,
              symbol: network.nativeCurrency.symbol,
              decimals: network.nativeCurrency.decimals,
            },
            rpcUrls: [primaryRpc],
            blockExplorerUrls: network.explorers?.length
              ? // @ts-ignore
                [network.explorers[0].url]
              : [],
          },
        ],
      });

      toast({
        title: 'Network added to MetaMask',
        description: `${network.name} has been added successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to add network',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{network.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Chain ID: {network.chainId}</Badge>
                  <Badge variant={isTestnet ? 'destructive' : 'default'}>
                    {isTestnet ? 'Testnet' : 'Mainnet'}
                  </Badge>
                  {network.nativeCurrency && (
                    <Badge variant="secondary">
                      {network.nativeCurrency.symbol}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Native Currency Info */}
            {network.nativeCurrency && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Native: {network.nativeCurrency.name} (
                {network.nativeCurrency.symbol})
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={addToMetaMask}
                className="flex items-center gap-1"
              >
                Add to MetaMask
              </Button>

              {network.explorers && network.explorers.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    // @ts-ignore
                    window.open(network.explorers![0].url, '_blank')
                  }
                  className="flex items-center gap-1"
                >
                  <ExternalLinkIcon className="h-3 w-3" />
                  Explorer
                </Button>
              )}

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <InfoCircledIcon className="h-3 w-3" />
                    More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div>
                        <span className="text-xl">{network.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            Chain ID: {network.chainId}
                          </Badge>
                          <Badge
                            variant={isTestnet ? 'destructive' : 'default'}
                          >
                            {isTestnet ? 'Testnet' : 'Mainnet'}
                          </Badge>
                          {network.nativeCurrency && (
                            <Badge variant="secondary">
                              {network.nativeCurrency.symbol}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-slate-500 mb-1">
                          Network Name
                        </h4>
                        <p className="text-sm">{network.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-slate-500 mb-1">
                          Chain ID
                        </h4>
                        <p className="text-sm">{network.chainId}</p>
                      </div>
                      {network.shortName && (
                        <div>
                          <h4 className="font-medium text-sm text-slate-500 mb-1">
                            Short Name
                          </h4>
                          <p className="text-sm">{network.shortName}</p>
                        </div>
                      )}
                      {network.networkId && (
                        <div>
                          <h4 className="font-medium text-sm text-slate-500 mb-1">
                            Network ID
                          </h4>
                          <p className="text-sm">{network.networkId}</p>
                        </div>
                      )}
                    </div>

                    {/* Native Currency */}
                    {network.nativeCurrency && (
                      <div>
                        <h4 className="font-medium mb-3">Native Currency</h4>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-medium text-sm text-slate-500 mb-1">
                              Name
                            </h5>
                            <p className="text-sm">
                              {network.nativeCurrency.name}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm text-slate-500 mb-1">
                              Symbol
                            </h5>
                            <p className="text-sm">
                              {network.nativeCurrency.symbol}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm text-slate-500 mb-1">
                              Decimals
                            </h5>
                            <p className="text-sm">
                              {network.nativeCurrency.decimals}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* RPC Endpoints */}
                    <RPCList rpcs={network.rpc} chainId={network.chainId} />

                    {/* Block Explorers */}
                    {network.explorers && network.explorers.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Block Explorers</h4>
                        <div className="space-y-2">
                          {network.explorers
                            .slice(0, 2)
                            .map((explorer, index) => (
                              <div
                                key={index}
                                className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"
                              >
                                <p className="font-medium text-sm">
                                  {explorer.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 break-all">
                                  {explorer.url}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Faucets */}
                    {network.faucets && network.faucets.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Faucets</h4>
                        <div className="flex flex-wrap gap-2">
                          {network.faucets.map((faucet, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(faucet, '_blank')}
                              className="text-xs"
                            >
                              <ExternalLinkIcon className="h-3 w-3 mr-1" />
                              Faucet {index + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="border-t pt-4">
                      <Button onClick={addToMetaMask} className="w-full">
                        Add to MetaMask
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
