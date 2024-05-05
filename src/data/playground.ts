import { Links } from '@config/constants';

export interface Item {
  title: string;
  description: string;
  link: string;
  isBeta?: boolean;
  isExternal?: boolean;
  onChain?: boolean;
  metadata?: { title: string; description: string };
  isWalletRequired?: boolean;
  component?: any;
}

export const playgroundToolsList: Item[] = [
  {
    title: 'EVM Storage Explorer (evmtools)',
    description: 'Analyze EVM bytecode, slots and storage layout',
    link: Links.evmTools,
    isExternal: true,
  },
  {
    title: 'ZK Boilerplate',
    description: 'ZK Boilerplate dapps using snarkjs and circom',
    link: Links.boilerplate,
    isBeta: false,
    isExternal: true,
  },
  {
    title: 'EIP 712',
    description:
      'EIP-712 is a protocol for hashing and signing of typed structured data instead of just bytestrings.',
    link: Links.eip712,
    isBeta: false,
  },
  {
    title: 'ERC 191',
    description:
      'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
    link: Links.erc191,
    isBeta: false,
  },
  {
    title: 'Checksum Address',
    description: 'Convert EVM addresses to checksum format.',
    link: Links.evmChecksumAddress,
    isBeta: false,
    isWalletRequired: false,
    // component: EvmAddressChecksumComponent,
  },
  // {
  //   title: 'Uniswap V3 (beta)',
  //   description:
  //     'Get all V3 positions by address. Supported on Ethereum, Polygon, Optimism & BSC',
  //   link: Links.pools,
  //   isBeta: true,
  //   onChain: true,
  // },
  // {
  //   title: 'Balance Tracker (beta)',
  //   description:
  //     'Multi-Chain balance tracker, get all ETH and token balances from Ethereum & Layer2 chains',
  //   link: Links.balanceTracker,
  //   isBeta: true,
  //   onChain: true,

  // },
  {
    title: 'Transaction Decoder',
    description:
      'Analyze and decode EVM transactions aiding in transaction analysis and debugging.',
    link: Links.txDecoder,
    isBeta: false,
    isWalletRequired: false,
    // component: TxDecoderComponent,
  },
  {
    title: 'Merkle Tree Generator',
    description:
      'Construct merkle trees and verify proofs using openzeppelin library.',
    link: Links.merkleTreeGenerator,
    isBeta: false,
    isWalletRequired: false,
    // component: MerkleTreeVerifier,
  },
  {
    title: 'Gas Convertor',
    description:
      'Convert between various gas units (wei, gwei, eth) for smart contracts on the EVM networks.',
    link: Links.gasConverter,
    isBeta: false,
    isWalletRequired: false,
    // component: GasConvertorComponent,
  },
  {
    title: 'Bytes & String Convertor',
    description: 'Convert between strings and bytes.',
    link: Links.byteconversion,
    isBeta: false,
    isWalletRequired: false,
    // component: StringByteConversion,
  },
  {
    title: 'Burner Wallet',
    description: 'Generate random private and public key pairs for EVM chains.',
    link: Links.burnerWallet,
    isBeta: false,
    isWalletRequired: false,
    // component: BurnerWalletComponent,
  },
  {
    title: 'Deterministic Contracts',
    description:
      'Generate contract address for next contract deployment from an address.',
    link: Links.contractAddressGen,
    isBeta: false,
    metadata: {
      title: 'Deterministic Contract Address | Zk block',
      description:
        'Generate the next deployment contract address from an account',
    },
  },
  {
    title: 'Cheatsheet',
    description: 'Solidity helpers',
    link: Links.cheatsheet,
    isBeta: false,
    isExternal: false,
    isWalletRequired: false,
  },
  // {
  //   title: 'EVM Visualizer (deprecating soon)',
  //   description: 'Analyze EVM bytecode, slots and storage layout',
  //   link: Links.evm,
  //   isExternal: true,
  // },
];
