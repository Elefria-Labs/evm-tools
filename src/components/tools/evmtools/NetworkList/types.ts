export interface NetworkRpc {
  url: string;
  tracking?: string;
  isOpenSource?: boolean;
}

export interface NetworkExplorer {
  name: string;
  url: string;
  standard: string;
  icon?: string;
}

export interface NetworkCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface NetworkParent {
  type: string;
  chain: string;
  bridges?: Array<{ url: string }>;
}

export interface NetworkFeature {
  name: string;
}

export interface Network {
  name: string;
  chain: string;
  chainId: number;
  networkId: number;
  shortName: string;
  nativeCurrency: NetworkCurrency;
  rpc: NetworkRpc[];
  infoURL: string;
  explorers?: NetworkExplorer[];
  icon?: string;
  faucets?: string[];
  tvl?: number;
  chainSlug?: string;
  status?: string;
  features?: NetworkFeature[];
  parent?: NetworkParent;
  slip44?: number;
}

export type NetworkType = 'mainnet' | 'testnet' | 'all';

export interface NetworkFilters {
  searchQuery: string;
  networkType: NetworkType;
  hasExplorers: boolean;
  hasFaucets: boolean;
}
