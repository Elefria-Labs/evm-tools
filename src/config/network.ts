import { BlockchainNetwork } from '@types';
import { toHex } from '@utils/wallet';

export const networkConfig: Record<string, BlockchainNetwork> = {
  '0x1': {
    name: 'Ethereum Mainnet',
    chainName: 'ETH',
    icon: 'ethereum',
    rpcUrls: [
      'https://mainnet.infura.io/v3/',
      'wss://mainnet.infura.io/ws/v3/',
      'https://api.mycryptoapi.com/eth',
      'https://cloudflare-eth.com',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://ethereum.org',
    shortName: 'eth',
    chainId: 1,
    networkId: 1,
    ens: {
      registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    blockExplorerUrls: [
      {
        name: 'etherscan',
        url: 'https://etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },
  '0x3': {
    name: 'Ropsten Testnet',
    title: 'Ethereum Testnet Ropsten',
    chainName: 'ETH',
    rpcUrls: [
      'https://ropsten.infura.io/v3/',
      'wss://ropsten.infura.io/ws/v3/',
    ],
    faucets: [
      'http://fauceth.komputing.org?chain=3&address=',
      'https://faucet.ropsten.be',
    ],
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ROP',
      decimals: 18,
    },
    infoURL: 'https://github.com/ethereum/ropsten',
    shortName: 'rop',
    chainId: 3,
    networkId: 3,
    ens: {
      registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    },
    blockExplorerUrls: [
      {
        name: 'etherscan',
        url: 'https://ropsten.etherscan.io',
        standard: 'EIP3091',
      },
    ],
  },

  '0x6357d2e0': {
    name: 'Harmony Testnet Shard 0',
    chainName: 'Harmony',
    rpcUrls: ['https://api.s0.b.hmny.io'],
    faucets: ['https://faucet.pops.one'],
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    infoURL: 'https://www.harmony.one/',
    shortName: 'hmy-b-s0',
    chainId: 1666700000,
    networkId: 1666700000,
    blockExplorerUrls: [
      {
        name: 'Harmony Testnet Block Explorer',
        url: 'https://explorer.pops.one',
        standard: 'EIP3091',
      },
    ],
  },
  '0x63564c40': {
    name: 'Harmony Mainnet Shard 0',
    chainName: 'Harmony',
    rpcUrls: ['https://api.harmony.one'],
    faucets: ['https://free-online-app.com/faucet-for-eth-evm-chains/'],
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    infoURL: 'https://www.harmony.one/',
    shortName: 'hmy-s0',
    chainId: 1666600000,
    networkId: 1666600000,
    blockExplorerUrls: [
      {
        name: 'Harmony Block Explorer',
        url: 'https://explorer.harmony.one',
        standard: 'EIP3091',
      },
    ],
  },
  '0x635ae020': {
    name: 'Harmony Devnet Testnet',
    chainName: 'Harmony',
    rpcUrls: ['https://api.s0.ps.hmny.io/'],
    faucets: ['http://dev.faucet.easynode.one/'],
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    infoURL: 'https://www.harmony.one/',
    shortName: 'hmy-b-s0',
    chainId: 1666900000,
    networkId: 1666900000,
    blockExplorerUrls: [
      {
        name: 'Harmony Testnet Block Explorer',
        url: 'https://explorer.ps.hmny.io/',
        standard: 'EIP3091',
      },
    ],
  },
  '0x89': {
    name: 'Polygon Mainnet',
    chainName: 'Polygon',
    rpcUrls: [
      'https://polygon-rpcUrls.com/',
      'https://rpcUrls-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpcUrls-mainnet.maticvigil.com',
      'https://rpcUrls-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpcUrls.bwarelabs.com',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'MATIC',
    chainId: 137,
    networkId: 137,
    blockExplorerUrls: [
      {
        name: 'polygonscan',
        url: 'https://polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  '0x13881': {
    name: 'Polygon Testnet Mumbai',
    title: 'Polygon Testnet Mumbai',
    chainName: 'Polygon',
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpcUrls-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpcUrls.bwarelabs.com',
    ],
    faucets: ['https://faucet.polygon.technology/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'maticmum',
    chainId: 80001,
    networkId: 80001,
    blockExplorerUrls: [
      {
        name: 'polygonscan',
        url: 'https://mumbai.polygonscan.com',
        standard: 'EIP3091',
      },
    ],
  },

  '0x38': {
    name: 'Binance Smart Chain Mainnet',
    chainName: 'BSC',
    rpcUrls: [
      'https://bsc-dataseed1.binance.org',
      'wss://bsc-ws-node.nariox.org',
    ],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    infoURL: 'https://www.binance.org',
    shortName: 'bnb',
    chainId: 56,
    networkId: 56,
    blockExplorerUrls: [
      {
        name: 'bscscan',
        url: 'https://bscscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  '0x61': {
    name: 'Binance Smart Chain',
    chainName: 'BSC',
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
    ],
    faucets: ['https://testnet.binance.org/faucet-smart'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'tBNB',
      decimals: 18,
    },
    infoURL: 'https://testnet.binance.org/',
    shortName: 'bnbt',
    chainId: 97,
    networkId: 97,
    blockExplorerUrls: [
      {
        name: 'bscscan-testnet',
        url: 'https://testnet.bscscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  '0x118': {
    name: 'zkSync alpha testnet (v2)',
    chainName: 'ZkSync',
    rpcUrls: ['https://zksync2-testnet.zksync.dev'],
    faucets: ['https://portal.zksync.io/bridge/faucet'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://v2-docs.zksync.io/dev/testnet/important-links.html',
    shortName: 'zksync',
    chainId: 280,
    networkId: 280,
    blockExplorerUrls: [
      {
        name: 'ZkSync Block Explorer',
        url: 'https://zksync2-testnet.zkscan.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x66eeb': {
    name: 'Arbitrum Rinkeby Testnet',
    chainName: 'Arbitrum Rinkeby',
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    faucets: [''],
    nativeCurrency: {
      name: 'RinkebyETH',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://developer.offchainlabs.com/public-chains',
    shortName: 'arbitrum',
    chainId: 421611,
    networkId: 421611,
    blockExplorerUrls: [
      {
        name: 'Arbitrum Rinkeby Explorer',
        url: 'https://rinkeby-explorer.arbitrum.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x66eed': {
    name: 'Arbitrum Nitro Rollup Testnet',
    chainName: 'Arbitrum Görli',
    rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
    faucets: [''],
    nativeCurrency: {
      name: 'GoerliETH',
      symbol: 'AGOR',
      decimals: 18,
    },
    infoURL: 'https://developer.offchainlabs.com/public-chains',
    shortName: 'arbitrum',
    chainId: 421613,
    networkId: 421613,
    blockExplorerUrls: [
      {
        name: 'Arbitrum Goereli Explorer',
        url: 'https://goerli-rollup-explorer.arbitrum.io',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0xa4b1': {
    name: 'Arbitrum One',
    chainName: 'Arbitrum One',
    rpcUrls: [
      'https://arb1.arbitrum.io/rpc',
      'https://arbitrum-mainnet.infura.io/v3/YOUR-PROJECT-ID',
    ],
    faucets: ['https://portal.zksync.io/bridge/faucet'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://bridge.arbitrum.io/',
    shortName: 'arbitrum',
    chainId: 42161,
    networkId: 42161,
    blockExplorerUrls: [
      {
        name: 'Arbitrum One Mainnet Explorer',
        url: 'https://arbiscan.io/',
      },
      {
        name: 'Arbitrum One Mainnet Explorer',
        url: 'https://explorer.arbitrum.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },

  '0x1a4': {
    name: 'Optimism Goerli Testnet',
    chainName: 'Optimism Goerli Testnet',
    rpcUrls: [
      'https://goerli.optimism.io',
      'https://opt-goerli.g.alchemy.com/v2/demo',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'Görli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://optimism.io',
    shortName: 'ogor',
    chainId: 420,
    networkId: 420,
    isZk: true,
    layer: 2,
  },
  '0xa4ba': {
    name: 'Arbitrum Nova',
    chainName: 'Arbitrum Nova',
    rpcUrls: ['https://nova.arbitrum.io/rpc'],
    faucets: [''],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://developer.offchainlabs.com/public-chains',
    shortName: 'arbitrum',
    chainId: 42170,
    networkId: 42170,
    blockExplorerUrls: [
      {
        name: 'Arbitrum Nova Mainnet Explorer',
        url: 'https://nova-explorer.arbitrum.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x58e': {
    name: 'Polygon zkEVM Testnet',
    chainName: 'Polygon zkEVM',
    rpcUrls: ['https://rpc.public.zkevm-test.net'],
    faucets: [''],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL:
      'https://blog.polygon.technology/your-three-step-guide-to-using-polygon-zkevm-yes-its-that-easy/',
    shortName: 'polygon-zkEVM',
    chainId: 1422,
    networkId: 1422,
    blockExplorerUrls: [
      {
        name: 'Arbitrum Nova Mainnet Explorer',
        url: 'https://explorer.public.zkevm-test.net',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x12c': {
    name: 'Optimism on Gnosis',
    chainName: 'OGC',
    rpcUrls: [
      'https://optimism.gnosischain.com',
      'wss://optimism.gnosischain.com/wss',
    ],
    faucets: ['https://faucet.gimlu.com/gnosis'],
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    infoURL:
      'https://www.xdaichain.com/for-developers/optimism-optimistic-rollups-on-gc',
    shortName: 'ogc',
    chainId: 300,
    networkId: 300,
    blockExplorerUrls: [
      {
        name: 'blockscout',
        url: 'https://blockscout.com/xdai/optimism',

        standard: 'EIP3091',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0xa': {
    name: 'Optimism',
    chainName: 'Optimism',
    rpcUrls: [
      'https://mainnet.optimism.io',
      'https://opt-mainnet.g.alchemy.com/v2/demo',
      'https://optimism-mainnet.public.blastapi.io',
      'https://rpc.ankr.com/optimism',
      'https://1rpc.io/op',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://optimism.io',
    shortName: 'oeth',
    chainId: 10,
    networkId: 10,
    blockExplorerUrls: [
      {
        name: 'etherscan',
        url: 'https://optimistic.etherscan.io',
        standard: 'EIP3091',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x82751': {
    name: 'Scroll Alpha Testnet',
    chainName: 'Scroll',
    rpcUrls: ['https://alpha-rpc.scroll.io/l2'],
    faucets: [
      'https://faucet.paradigm.xyz/',
      'https://goerli-faucet.pk910.de/',
      'https://scroll.io/alpha/bridge',
    ],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://guide.scroll.io/user-guide/setup',
    shortName: 'scroll',
    chainId: 534353,
    networkId: 534353,
    blockExplorerUrls: [
      {
        name: 'scroll',
        url: 'https://blockscout.scroll.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x14a33': {
    name: 'Base Goerli Testnet',
    chainName: 'Base',
    rpcUrls: ['https://goerli.base.org'],
    faucets: [
      'https://faucet.paradigm.xyz/',
      'https://goerli-faucet.pk910.de/',
    ],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://bridge.base.org/',
    shortName: 'base',
    chainId: 84531,
    networkId: 84531,
    blockExplorerUrls: [
      {
        name: 'base',
        url: 'https://goerli.basescan.org',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x28c5c': {
    name: 'Alpha-2 Testnet',
    chainName: 'Taiko',
    rpcUrls: ['https://rpc.a2.taiko.xyz'],
    faucets: ['https://sepoliafaucet.com/', 'https://faucet.sepolia.dev/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://taiko.xyz/docs/reference/rpc-configuration',
    shortName: 'taiko',
    chainId: 167004,
    networkId: 167004,
    blockExplorerUrls: [
      {
        name: 'base',
        url: 'https://explorer.a2.taiko.xyz',
      },
    ],
    isZk: true,
    layer: 2,
  },
  '0x144': {
    name: 'zkSync Era Mainnet',
    chainName: 'zkSync',
    rpcUrls: ['https://mainnet.era.zksync.io'],
    faucets: ['https://sepoliafaucet.com/', 'https://faucet.sepolia.dev/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://era.zksync.io/docs/dev/fundamentals/interacting.html',
    shortName: 'zksync',
    chainId: 324,
    networkId: 324,
    blockExplorerUrls: [
      {
        name: 'zksync',
        url: 'https://explorer.zksync.io/',
      },
    ],
    isZk: true,
    layer: 2,
  },
};

export type AddEthereumChainParameterType = {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
};

export const getNetworkForMetamask = (
  network: any,
): AddEthereumChainParameterType => {
  delete network['name'];
  delete network['faucets'];
  delete network['infoURL'];
  delete network['networkId'];
  delete network['shortName'];
  delete network['title'];
  delete network['blockExplorerUrls'];
  delete network['type'];
  delete network['isZk'];
  delete network['layer'];
  delete network['parent'];
  network['chainId'] = toHex(network['chainId']);
  return network;
};

// This is not working for some reason
// '0xc8': {
//   name: 'Arbitrum on xDai',
//   chainName: 'Arbitrum on xDai',
//   rpcUrls: ['https://arbitrum.xdaichain.com'],
//   faucets: [],
//   nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
//   infoURL: 'https://xdaichain.com',
//   shortName: 'aox',
//   chainId: 200,
//   networkId: 200,
//   blockExplorerUrls: [
//     {
//       name: 'blockscout',
//       url: 'https://blockscout.com/xdai/arbitrum',
//       standard: 'EIP3091',
//     },
//   ],
//   parent: { chain: 'eip155-100', type: 'L2' },
//   isZk: true,
//   layer: 2,
// },

// '0x45': {
//   name: 'Optimism Kovan',
//   chainName: 'Optimism Testnet Kovan',
//   rpcUrls: ['https://kovan.optimism.io/'],
//   faucets: ['http://fauceth.komputing.org?chain=69&address=${ADDRESS}'],
//   nativeCurrency: {
//     name: 'Kovan Ether',
//     symbol: 'ETH',
//     decimals: 18,
//   },
//   blockExplorerUrls: [
//     {
//       name: 'etherscan',
//       url: 'https://kovan-optimistic.etherscan.io',
//       standard: 'EIP3091',
//     },
//   ],
//   infoURL: 'https://optimism.io',
//   shortName: 'okov',
//   chainId: 69,
//   networkId: 69,
//   isZk: true,
//   layer: 2,
// },
