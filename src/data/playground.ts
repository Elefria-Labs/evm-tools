import { Links } from '@config/constants';

import HexConvertorComponent from '@components/tools/evmtools/HexConvertorComponent';
import Eip712Component from '@components/eip712-playground/Eip712Component';
import PersonalSignComponent from '@components/personal-sign/PersonalSignComponent';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import DeterministicAddress from '@components/tools/evmtools/DeterministicAddress';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';
import EVMAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import GasConvertorComponent from '@components/tools/evmtools/GasConvertorComponent';
import HashingComponent from '@components/tools/evmtools/HashingComponent';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import MimicWalletComponent from '@components/tools/evmtools/MimicWalletComponent';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';

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
  // TODO
  // {
  //   title: 'EVM Storage Explorer',
  //   description: 'Analyze EVM bytecode, slots and storage layout',
  //   link: Links.evmTools,
  //   isExternal: true,
  // },
  {
    title: 'EIP-712',
    description:
      'EIP-712 is a protocol for hashing and signing of typed structured data instead of just bytestrings.',
    link: Links.eip712,
    isBeta: false,
    component: Eip712Component,
  },
  {
    title: 'ERC-191',
    description:
      'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
    link: Links.erc191,
    isBeta: false,
    component: PersonalSignComponent,
  },
  {
    title: 'Checksum Address',
    description: 'Convert EVM addresses to checksum format.',
    link: Links.evmChecksumAddress,
    isBeta: false,
    isWalletRequired: false,
    component: EVMAddressChecksumComponent,
  },
  {
    title: 'ZK Boilerplate',
    description: 'ZK Boilerplate dapps using snarkjs and circom.',
    link: Links.boilerplate,
    isBeta: false,
    isExternal: true,
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
    component: TxDecoderComponent,
  },
  {
    title: 'Hashing Utils',
    description: 'Derive hashes from text such as keccak256, sha256, sha512.',
    link: Links.hashing,
    isBeta: false,
    isWalletRequired: false,
    component: HashingComponent,
  },
  {
    title: 'Merkle Tree Generator',
    description:
      'Construct merkle trees and verify proofs using openzeppelin library.',
    link: Links.merkleTreeGenerator,
    isBeta: false,
    isWalletRequired: false,
    component: MerkleTreeVerifier,
  },
  {
    title: 'Gas Convertor',
    description:
      'Convert between various gas units (wei, gwei, eth) for smart contracts on the EVM networks.',
    link: Links.gasConverter,
    isBeta: false,
    isWalletRequired: false,
    component: GasConvertorComponent,
  },
  {
    title: 'Bytes & String Convertor',
    description: 'Convert between strings and bytes.',
    link: Links.byteconversion,
    isBeta: false,
    isWalletRequired: false,
    component: StringByteConversion,
  },
  {
    title: 'Burner Wallet',
    description: 'Generate random private and public key pairs for EVM chains.',
    link: Links.burnerWallet,
    isBeta: false,
    isWalletRequired: false,
    component: BurnerWalletComponent,
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
    component: DeterministicAddress,
  },
  {
    title: 'Mimic Wallet',
    description:
      'Mimic (EOA or multisig) address connection to any dapp using wallet connect.',
    link: Links.mimicWallet,
    isBeta: false,
    isExternal: false,
    isWalletRequired: true,
    component: MimicWalletComponent,
  },
  {
    title: 'Cheatsheet',
    description:
      'Solidity helpers such uint, int max values, zero address, etc.',
    link: Links.cheatsheet,
    isBeta: false,
    isExternal: false,
    isWalletRequired: false,
    component: CheatsheetComponent,
  },
  {
    title: 'Hex Convertor',
    description: 'Decimal to hex and binary convertor.',
    link: Links.hexConvertor,
    isBeta: false,
    isExternal: false,
    isWalletRequired: true,
    component: HexConvertorComponent,
  },
  // {
  //   title: 'EVM Visualizer (deprecating soon)',
  //   description: 'Analyze EVM bytecode, slots and storage layout',
  //   link: Links.evm,
  //   isExternal: true,
  // },
];
