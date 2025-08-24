export interface ChainInfo {
  id: number;
  name: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
  };
}

export const SUPPORTED_CHAINS: Record<number, ChainInfo> = {
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH' },
  },
  11155111: {
    id: 11155111,
    name: 'Sepolia',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP' },
  },
  137: {
    id: 137,
    name: 'Polygon',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC' },
  },
  10: {
    id: 10,
    name: 'Optimism',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH' },
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH' },
  },
  8453: {
    id: 8453,
    name: 'Base',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH' },
  },
};

export function getChainInfo(chainId: number): ChainInfo | undefined {
  return SUPPORTED_CHAINS[chainId];
}

export function getExplorerUrl(chainId: number, address: string): string {
  const chain = getChainInfo(chainId);
  if (!chain) {
    // Default to Ethereum mainnet if chain not found
    return `https://etherscan.io/address/${address}`;
  }
  return `${chain.explorerUrl}/address/${address}`;
}

export function getChainName(chainId: number): string {
  const chain = getChainInfo(chainId);
  return chain?.name || `Chain ${chainId}`;
}
