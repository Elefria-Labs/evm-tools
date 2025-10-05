import { Address } from 'viem';

import {
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  polygon,
  blast,
  zora,
  unichain,
  unichainSepolia,
  mainnet,
} from 'viem/chains';

// Chain configurations with Position Manager addresses
export interface ChainConfig {
  chainId: number;
  name: string;
  chain: any;
  positionManager: Address;
  blockExplorer: string;
  isTestnet?: boolean;
}

const worldchain = {
  id: 480,
  name: 'Worldchain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: {
      name: 'Worldchain Explorer',
      url: 'https://world-chain.superbridge.app',
    },
  },
};

const ink = {
  id: 57073,
  name: 'Ink',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-gel.inkonchain.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Ink Explorer',
      url: 'https://explorer.inkonchain.com',
    },
  },
};

export const V4_POSITION_MANAGER_CHAIN_CONFIGS: ChainConfig[] = [
  // Mainnets
  {
    chainId: 1,
    name: 'Ethereum',
    chain: mainnet,
    positionManager: '0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e',
    blockExplorer: 'https://etherscan.io',
  },
  {
    chainId: 130,
    name: 'Unichain',
    chain: unichain,
    positionManager: '0x4529a01c7a0410167c5740c487a8de60232617bf',
    blockExplorer: 'https://unichain.blockscout.com',
  },
  {
    chainId: 10,
    name: 'Optimism',
    chain: optimism,
    positionManager: '0x3c3ea4b57a46241e54610e5f022e5c45859a1017',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
  {
    chainId: 8453,
    name: 'Base',
    chain: base,
    positionManager: '0x7c5f5a4bbd8fd63184577525326123b519429bdc',
    blockExplorer: 'https://basescan.org',
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    chain: arbitrum,
    positionManager: '0xd88f38f930b7952f2db2432cb002e7abbf3dd869',
    blockExplorer: 'https://arbiscan.io',
  },
  {
    chainId: 137,
    name: 'Polygon',
    chain: polygon,
    positionManager: '0x1ec2ebf4f37e7363fdfe3551602425af0b3ceef9',
    blockExplorer: 'https://polygonscan.com',
  },
  {
    chainId: 81457,
    name: 'Blast',
    chain: blast,
    positionManager: '0x4ad2f4cca2682cbb5b950d660dd458a1d3f1baad',
    blockExplorer: 'https://blastscan.io',
  },
  {
    chainId: 7777777,
    name: 'Zora',
    chain: zora,
    positionManager: '0xf66c7b99e2040f0d9b326b3b7c152e9663543d63',
    blockExplorer: 'https://explorer.zora.energy',
  },
  {
    chainId: 480,
    name: 'Worldchain',
    chain: worldchain,
    positionManager: '0xc585e0f504613b5fbf874f21af14c65260fb41fa',
    blockExplorer: 'https://worldchain-mainnet.explorer.alchemy.com',
  },
  {
    chainId: 57073,
    name: 'Ink',
    chain: ink,
    positionManager: '0x1b35d13a2e2528f192637f14b05f0dc0e7deb566',
    blockExplorer: 'https://explorer.inkonchain.com',
  },
  // Testnets
  {
    chainId: 1301,
    name: 'Unichain Sepolia',
    chain: unichainSepolia,
    positionManager: '0xf969aee60879c54baaed9f3ed26147db216fd664',
    blockExplorer: 'https://unichain-sepolia.blockscout.com',
    isTestnet: true,
  },
  {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    chain: sepolia,
    positionManager: '0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4',
    blockExplorer: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
  {
    chainId: 84532,
    name: 'Base Sepolia',
    chain: baseSepolia,
    positionManager: '0x4b2c77d209d3405f41a037ec6c77f7f5b8e2ca80',
    blockExplorer: 'https://sepolia.basescan.org',
    isTestnet: true,
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    chain: arbitrumSepolia,
    positionManager: '0xAc631556d3d4019C95769033B5E719dD77124BAc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    isTestnet: true,
  },
];

// Position Manager ABI for poolKeys function
export const POSITION_MANAGER_ABI = [
  {
    inputs: [{ name: 'poolId', type: 'bytes25' }],
    name: 'poolKeys',
    outputs: [
      {
        components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickSpacing', type: 'int24' },
          { name: 'hooks', type: 'address' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
