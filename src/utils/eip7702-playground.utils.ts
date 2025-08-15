import { isAddress, zeroAddress } from 'viem';
import {
  AuthorizationTuple,
  DelegationCode,
  CrossChainAuthorization,
  ContractImplementation,
  DelegationTransaction,
} from '../types/eip7702-playground.types';
import {
  Eip7702Authorization,
  Eip7702AuthorizationSigned,
} from '../types/eip7702.types';

// EIP-7702 delegation code prefix
export const DELEGATION_PREFIX = '0xef0100';

/**
 * Creates delegation code by combining prefix with implementation address
 */
export function createDelegationCode(
  implementationAddress: string,
): DelegationCode {
  if (!isAddress(implementationAddress)) {
    throw new Error('Invalid implementation address');
  }

  const cleanAddress = implementationAddress.toLowerCase().replace('0x', '');
  const fullCode = DELEGATION_PREFIX + cleanAddress;

  return {
    prefix: DELEGATION_PREFIX,
    implementationAddress: implementationAddress,
    fullCode: fullCode,
  };
}

/**
 * Parses delegation code to extract implementation address
 */
export function parseDelegationCode(
  delegationCode: string,
): DelegationCode | null {
  if (!delegationCode.startsWith(DELEGATION_PREFIX)) {
    return null;
  }

  const addressPart = '0x' + delegationCode.slice(DELEGATION_PREFIX.length);
  if (!isAddress(addressPart)) {
    return null;
  }

  return {
    prefix: DELEGATION_PREFIX,
    implementationAddress: addressPart,
    fullCode: delegationCode,
  };
}

/**
 * Converts signed authorization to authorization tuple format
 */
export function authorizationToTuple(
  auth: Eip7702AuthorizationSigned,
): AuthorizationTuple {
  return {
    chainId: auth.chainId,
    address: auth.address,
    nonce: auth.nonce,
    yParity: auth.yParity,
    r: auth.r,
    s: auth.s,
  };
}

/**
 * Formats authorization tuple for contract calls
 */
export function formatAuthorizationTupleForContract(
  tuple: AuthorizationTuple,
): string {
  return `(${tuple.chainId}, ${tuple.address}, ${tuple.nonce}, ${tuple.yParity}, ${tuple.r}, ${tuple.s})`;
}

/**
 * Creates cross-chain authorization (chainId = 0 for global)
 */
export function createCrossChainAuthorization(
  implementationAddress: string,
  nonce: number,
  targetChains: number[] = [],
): CrossChainAuthorization {
  const isGlobal = targetChains.length === 0;

  return {
    chainId: isGlobal ? BigInt(0) : BigInt(targetChains[0]), // Use 0 for global, first chain for specific
    address: implementationAddress,
    nonce: BigInt(nonce),
    targetChains,
    isGlobal,
  };
}

/**
 * Creates revocation authorization (points to zero address)
 */
export function createRevocationAuthorization(
  chainId: number,
  nonce: number,
): Eip7702Authorization {
  return {
    chainId: BigInt(chainId),
    address: zeroAddress,
    nonce: BigInt(nonce),
  };
}

/**
 * Validates authorization tuple
 */
export function validateAuthorizationTuple(tuple: AuthorizationTuple): boolean {
  try {
    // Check chain ID
    if (tuple.chainId < 0n) return false;

    // Check address
    if (!isAddress(tuple.address)) return false;

    // Check nonce
    if (tuple.nonce < 0n) return false;

    // Check signature components
    if (tuple.yParity !== 0 && tuple.yParity !== 1) return false;
    if (!/^0x[0-9a-fA-F]{64}$/.test(tuple.r)) return false;
    if (!/^0x[0-9a-fA-F]{64}$/.test(tuple.s)) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Creates EIP-7702 transaction with authorization list
 */
export function createEip7702Transaction(
  to: string,
  data: string,
  authorizationList: AuthorizationTuple[],
  options: {
    value?: string;
    gasLimit?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
  } = {},
): DelegationTransaction {
  return {
    to,
    data,
    value: options.value || '0',
    gasLimit: options.gasLimit || '100000',
    maxFeePerGas: options.maxFeePerGas,
    maxPriorityFeePerGas: options.maxPriorityFeePerGas,
    authorizationList,
  };
}

/**
 * Default contract implementations for different use cases
 */
export const DEFAULT_IMPLEMENTATIONS: ContractImplementation[] = [
  {
    id: 'metamask-delegation',
    name: 'MetaMask Delegation',
    description:
      'MetaMask official delegation contract for account abstraction',
    address: '0x63c0c19a282a1b52b07dd5a65b58948a07dae32b',
    category: 'wallet',
    chainSupport: [1, 11155111, 137, 10, 42161, 8453],
    isVerified: true,
    deploymentInfo: {
      deployer: 'MetaMask',
    },
    features: [
      'Account abstraction',
      'Delegation management',
      'EIP-7702 support',
    ],
    documentation: 'https://metamask.io/',
  },
  {
    id: 'safe-multisig',
    name: 'Safe Multisig',
    description: 'Industry standard multisig wallet implementation',
    address: '0xd9db270c1b5e3bd161e8c8503c55ceabee709552',
    category: 'multisig',
    chainSupport: [1, 11155111, 137, 10, 42161],
    isVerified: true,
    deploymentInfo: {
      deployer: 'Safe Global',
    },
    features: ['Multi-signature', 'Transaction batching', 'Module support'],
    documentation: 'https://docs.safe.global/',
  },
  {
    id: 'timelock-controller',
    name: 'Timelock Controller',
    description: 'OpenZeppelin Timelock for delayed execution',
    address: '0x0000000000000000000000000000000000000001', // Example
    category: 'timelock',
    chainSupport: [1, 11155111, 137],
    isVerified: true,
    deploymentInfo: {
      deployer: 'OpenZeppelin',
    },
    features: [
      'Delayed execution',
      'Cancellable operations',
      'Role-based access',
    ],
  },
  {
    id: 'erc1967-proxy',
    name: 'ERC-1967 Proxy',
    description: 'Upgradeable proxy pattern implementation',
    address: '0x0000000000000000000000000000000000000002', // Example
    category: 'proxy',
    chainSupport: [1, 11155111, 137, 10, 42161],
    isVerified: true,
    deploymentInfo: {},
    features: ['Upgradeable logic', 'Storage separation', 'Admin controls'],
  },
  {
    id: 'session-key-manager',
    name: 'Session Key Manager',
    description: 'Manage temporary session keys for dApp interactions',
    address: '0x0000000000000000000000000000000000000003', // Example
    category: 'wallet',
    chainSupport: [1, 11155111, 137],
    isVerified: false,
    deploymentInfo: {},
    features: ['Session keys', 'Time-limited access', 'Scope restrictions'],
  },
];

/**
 * Get implementation by ID
 */
export function getImplementationById(
  id: string,
): ContractImplementation | undefined {
  return DEFAULT_IMPLEMENTATIONS.find((impl) => impl.id === id);
}

/**
 * Filter implementations by chain support
 */
export function getImplementationsByChain(
  chainId: number,
): ContractImplementation[] {
  return DEFAULT_IMPLEMENTATIONS.filter((impl) =>
    impl.chainSupport.includes(chainId),
  );
}

/**
 * Check if delegation code is revocation (points to zero address)
 */
export function isDelegationRevocation(delegationCode: string): boolean {
  const parsed = parseDelegationCode(delegationCode);
  return parsed?.implementationAddress === zeroAddress;
}

/**
 * Calculate estimated gas for EIP-7702 transaction
 */
export function estimateEip7702Gas(authorizationCount: number): string {
  // Base gas + per authorization overhead
  const baseGas = 21000;
  const perAuthGas = 25000; // Estimated per authorization
  const totalGas = baseGas + authorizationCount * perAuthGas;
  return totalGas.toString();
}
