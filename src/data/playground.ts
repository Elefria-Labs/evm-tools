import { Links } from '@config/constants';

import HexConverterComponent from '@components/tools/evmtools/HexConverterComponent';
import Eip712Component from '@components/eip712-playground/Eip712Component';
import PersonalSignComponent from '@components/personal-sign/PersonalSignComponent';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import DeterministicAddress from '@components/tools/evmtools/DeterministicAddress';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';
import EVMAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import HashingComponent from '@components/tools/evmtools/HashingComponent';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import MimicWalletComponent from '@components/tools/evmtools/MimicWalletComponent';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';
import ShamirSecretSharingComponent from '@components/tools/evmtools/ShamirSecretSharingComponent';
import AddressBookComponent from '@components/tools/evmtools/AddressBookComponent';
import GasConverterComponent from '@components/tools/evmtools/GasConvertorComponent';
import UniswapV4ToolComponent from '@components/tools/evmtools/UniswapV4Tools';
import MarketData from '@components/tools/market/MarketDetails';
import BitMaskingComponent from '@components/tools/evmtools/BitMasking';
import EpochConverterComponent from '@components/tools/evmtools/EpochConverterComponent';

export interface Item {
  title: string;
  description: string;
  link: string;
  isBeta?: boolean;
  isExternal?: boolean;
  onChain?: boolean;
  metadata?: { title: string; description: string };
  isWalletRequired?: boolean;
  component: any;
  isOnlyWeb?: boolean;
  isOnlyExtension?: boolean;
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
    component: Eip712Component,
    isOnlyWeb: true,
  },
  {
    title: 'ERC-191',
    description:
      'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
    link: Links.erc191,
    component: PersonalSignComponent,
    isOnlyWeb: true,
  },
  {
    title: 'Checksum Address',
    description: 'Convert EVM addresses to checksum format.',
    link: Links.evmChecksumAddress,
    isWalletRequired: false,
    component: EVMAddressChecksumComponent,
  },
  {
    title: 'ZK Boilerplate',
    description: 'ZK Boilerplate dapps using snarkjs and circom.',
    link: Links.boilerplate,
    isExternal: true,
    isOnlyWeb: true,
    component: null,
  },
  {
    title: 'Uniswap Utils',
    description: 'Derive token price from tick or sqrtX96.',
    link: Links.uniswapV4Tools,
    isExternal: false,
    component: UniswapV4ToolComponent,
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
    isWalletRequired: false,
    component: TxDecoderComponent,
  },
  {
    title: 'Hashing Utils',
    description: 'Derive hashes from text such as keccak256, sha256, sha512.',
    link: Links.hashing,
    isWalletRequired: false,
    component: HashingComponent,
  },
  {
    title: 'Merkle Tree Generator',
    description:
      'Construct merkle trees and verify proofs using openzeppelin library.',
    link: Links.merkleTreeGenerator,
    isWalletRequired: false,
    component: MerkleTreeVerifier,
  },
  {
    title: 'Gas Converter',
    description:
      'Convert between various gas units (wei, gwei, eth) for smart contracts on the EVM networks.',
    link: Links.gasConverter,
    isWalletRequired: false,
    component: GasConverterComponent,
  },
  {
    title: 'Bytes & String Converter',
    description: 'Convert between strings and bytes.',
    link: Links.byteconversion,
    isWalletRequired: false,
    component: StringByteConversion,
  },
  {
    title: 'Burner Wallet',
    description: 'Generate random private and public key pairs for EVM chains.',
    link: Links.burnerWallet,
    isWalletRequired: false,
    component: BurnerWalletComponent,
  },
  {
    title: 'Deterministic Contracts',
    description:
      'Generate contract address for next contract deployment from an address.',
    link: Links.contractAddressGen,
    metadata: {
      title: 'Deterministic Contract Address | Zk block',
      description:
        'Generate the next deployment contract address from an account',
    },
    component: DeterministicAddress,
    isOnlyWeb: true,
  },
  {
    title: 'Mimic Wallet',
    description:
      'Mimic (EOA or multisig) address connection to any dapp using wallet connect.',
    link: Links.mimicWallet,
    isExternal: false,
    isWalletRequired: false,
    component: MimicWalletComponent,
  },
  {
    title: 'Cheatsheet',
    description:
      'Solidity helpers such uint, int max values, zero address, etc.',
    link: Links.cheatsheet,
    isWalletRequired: false,
    component: CheatsheetComponent,
  },
  {
    title: 'Hex Converter',
    description: 'Decimal to hex and binary converter.',
    link: Links.hexConverter,
    component: HexConverterComponent,
  },
  {
    title: 'Shamir Secret Demo',
    description:
      'Shares can be used to reconstruct the secret when a threshold of shares are combined.',
    link: Links.shamirsSecret,
    component: ShamirSecretSharingComponent,
  },
  {
    title: 'Address Book',
    description:
      'Store your favorite EVM address in local storage for easy access.',
    link: Links.addressBook,
    component: AddressBookComponent,
  },
  {
    title: 'Market Data',
    description: 'Check crypto prices, market cap and save your watchlist.',
    link: Links.marketData,
    component: MarketData,
    isOnlyExtension: true,
  },
  {
    title: 'Bit Manipulation',
    description:
      'Perform bit manipulation, apply mask for upto 256 bit integers.',
    link: Links.bitManipulation,
    component: BitMaskingComponent,
    isBeta: true,
  },
  {
    title: 'Epoch Converter',
    description:
      'Time helpers, seconds converter, convert between unix timestamp and readable date format.',
    link: Links.epochConverter,
    component: EpochConverterComponent,
  },
  // {
  //   title: 'EVM Visualizer (deprecating soon)',
  //   description: 'Analyze EVM bytecode, slots and storage layout',
  //   link: Links.evm,
  //   isExternal: true,
  // },
];
