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
import UniswapV4HooksCheckerComponent from '@components/tools/evmtools/UniswapV4HooksCheckerComponent';
import BaseContractUiComponent from '@components/tools/evmtools/BaseContractUiComponent';
import ContractGenerator from '@components/tools/evmtools/HooksTemplateGeneratorComponent';
import HookMinerComponent from '@components/tools/evmtools/HooksMinerComponent';
import ContractAbiEncoder from '@components/tools/evmtools/ContractEncoderComponent';
import ENSResolverTool from '@components/tools/evmtools/EnsToolsComponent';
import ENSRecordInspectorComponent from '@components/tools/evmtools/EnsRecordsComponent';

export enum ToolCategory {
  DecodersAndConverters = 'Converters & Decoders',
  WalletAndSignatures = 'Wallets & Signatures',
  Contracts = 'Contracts',
  Zk = 'ZK',
  Defi = 'DeFi',
  Miscellaneous = 'Miscellaneous',
}
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
  category: ToolCategory;
  commonlyUsed?: boolean;
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
    category: ToolCategory.WalletAndSignatures,
    commonlyUsed: true,
  },
  {
    title: 'ERC-191',
    description:
      'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
    link: Links.erc191,
    component: PersonalSignComponent,
    isOnlyWeb: true,
    category: ToolCategory.WalletAndSignatures,
  },
  {
    title: 'Checksum Address',
    description: 'Convert EVM addresses to checksum format.',
    link: Links.evmChecksumAddress,
    isWalletRequired: false,
    component: EVMAddressChecksumComponent,
    category: ToolCategory.Miscellaneous,
  },
  {
    title: 'ZK Boilerplate',
    description: 'ZK Boilerplate dapps using snarkjs and circom.',
    link: Links.boilerplate,
    isExternal: true,
    isOnlyWeb: true,
    component: null,
    category: ToolCategory.Zk,
  },
  {
    title: 'Uniswap Price Utils',
    description: 'Derive token price from tick or sqrtX96.',
    link: Links.uniswapV4Tools,
    isExternal: false,
    component: UniswapV4ToolComponent,
    category: ToolCategory.Defi,
  },
  {
    title: 'Uniswap V4 Hooks Miner',
    description: 'Mine salt for uniswap v4 hooks address.',
    link: Links.uniswapV4HooksMiner,
    isExternal: false,
    isBeta: false,
    isWalletRequired: false,
    isOnlyWeb: true,
    component: HookMinerComponent,
    category: ToolCategory.Defi,
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
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Hashing Utils',
    description: 'Derive hashes from text such as keccak256, sha256, sha512.',
    link: Links.hashing,
    isWalletRequired: false,
    component: HashingComponent,
    category: ToolCategory.DecodersAndConverters,
    commonlyUsed: true,
  },
  {
    title: 'Merkle Tree Generator',
    description:
      'Construct merkle trees and verify proofs using openzeppelin library.',
    link: Links.merkleTreeGenerator,
    isWalletRequired: false,
    component: MerkleTreeVerifier,
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Gas Converter',
    description:
      'Convert between various gas units (wei, gwei, eth) for smart contracts on the EVM networks.',
    link: Links.gasConverter,
    isWalletRequired: false,
    component: GasConverterComponent,
    category: ToolCategory.DecodersAndConverters,
    commonlyUsed: true,
  },
  {
    title: 'Bytes & String Converter',
    description: 'Convert between strings and bytes.',
    link: Links.byteconversion,
    isWalletRequired: false,
    component: StringByteConversion,
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Burner Wallet',
    description: 'Generate random private and public key pairs for EVM chains.',
    link: Links.burnerWallet,
    isWalletRequired: false,
    component: BurnerWalletComponent,
    category: ToolCategory.WalletAndSignatures,
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
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Mimic Wallet',
    description:
      'Mimic (EOA or multisig) address connection to any dapp using wallet connect.',
    link: Links.mimicWallet,
    isExternal: false,
    isWalletRequired: false,
    component: MimicWalletComponent,
    category: ToolCategory.WalletAndSignatures,
  },
  {
    title: 'Cheatsheet',
    description:
      'Solidity helpers such uint, int max values, zero address, etc.',
    link: Links.cheatsheet,
    isWalletRequired: false,
    component: CheatsheetComponent,
    category: ToolCategory.Miscellaneous,
  },
  {
    title: 'Hex Converter',
    description: 'Decimal to hex and binary converter.',
    link: Links.hexConverter,
    component: HexConverterComponent,
    category: ToolCategory.DecodersAndConverters,
    commonlyUsed: true,
  },
  {
    title: 'Shamir Secret Demo',
    description:
      'Shares can be used to reconstruct the secret when a threshold of shares are combined.',
    link: Links.shamirsSecret,
    component: ShamirSecretSharingComponent,
    category: ToolCategory.Miscellaneous,
  },
  {
    title: 'Address Book',
    description:
      'Store your favorite EVM address in local storage for easy access.',
    link: Links.addressBook,
    component: AddressBookComponent,
    category: ToolCategory.Miscellaneous,
  },
  {
    title: 'Market Data',
    description: 'Check crypto prices, market cap and save your watchlist.',
    link: Links.marketData,
    component: MarketData,
    isOnlyExtension: true,
    category: ToolCategory.Miscellaneous,
  },
  {
    title: 'Bit Manipulation',
    description:
      'Perform bit manipulation, apply mask for upto 256 bit integers.',
    link: Links.bitManipulation,
    component: BitMaskingComponent,
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Epoch Converter',
    description:
      'Time helpers, seconds converter, convert between unix timestamp and readable date format.',
    link: Links.epochConverter,
    component: EpochConverterComponent,
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'Uniswap V4 Hooks Checker',
    description:
      'Check which Uniswap V4 hooks are enabled from the hook address.',
    link: Links.uniswapV4HooksChecker,
    component: UniswapV4HooksCheckerComponent,
    isWalletRequired: false,
    category: ToolCategory.Defi,
  },
  {
    title: 'Uniswap V4 Hooks Template Generator',
    description: 'Generate your hook template based on selected hooks.',
    link: Links.uniswapV4HooksTemplateGenerator,
    component: ContractGenerator,
    category: ToolCategory.Defi,
  },
  {
    title: 'Contracts UI',
    description:
      'Interact with multiple contracts at the same time. Call read and write functions.',
    link: Links.contractsUi,
    component: BaseContractUiComponent,
    isBeta: true,
    category: ToolCategory.Contracts,
    isOnlyWeb: true,
  },
  {
    title: 'Abi Encoder',
    description: 'Encode smart contract function parameters.',
    link: Links.abiEncoder,
    component: ContractAbiEncoder,
    isBeta: false,
    isWalletRequired: false,
    category: ToolCategory.Contracts,
  },

  {
    title: 'ENS Lookup',
    description: 'ENS Lookup and Reverse Lookup',
    link: Links.ensLookup,
    component: ENSResolverTool,
    isBeta: true,
    isWalletRequired: false,
    category: ToolCategory.DecodersAndConverters,
  },
  {
    title: 'ENS Record Inspector',
    description: 'Inspect ENS records',
    link: Links.ensRecordInspector,
    component: ENSRecordInspectorComponent,
    isBeta: true,
    isWalletRequired: false,
    category: ToolCategory.DecodersAndConverters,
  },

  // {
  //   title: 'HD Key Generator',
  //   description: 'Derive keys using mnemonic phrase and BIP44 derivation',
  //   link: Links.hdKeyGenerator,
  //   component: HdKeyGeneratorComponent,
  //   isBeta: true,
  // },
  // {
  //   title: 'EVM Visualizer (deprecating soon)',
  //   description: 'Analyze EVM bytecode, slots and storage layout',
  //   link: Links.evm,
  //   isExternal: true,
  // },
];

export const playgroundToolKeyRecord: Record<string, Item> =
  playgroundToolsList.reduce(
    (map, item) => ({ ...map, [item.link]: item }),
    {},
  );
