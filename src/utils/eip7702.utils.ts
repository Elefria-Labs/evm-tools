import {
  type Hex,
  parseSignature as viemParseSignature,
  isAddress,
  zeroAddress,
  verifyTypedData,
  hashTypedData,
} from 'viem';
import {
  Eip7702Authorization,
  Eip7702TypedData,
  AuthorizationTemplate,
  Eip7702AuthorizationSigned,
} from '../types/eip7702.types';

export function createEip7702TypedData(
  authorization: Eip7702Authorization,
  chainId: number = 1,
): Eip7702TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Authorization: [
        { name: 'chainId', type: 'uint256' },
        { name: 'address', type: 'address' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
    primaryType: 'Authorization',
    domain: {
      name: 'EIP-7702',
      version: '1',
      chainId: chainId,
      // verifyingContract: undefined, // Make it compatible with Wagmi's expected domain type
    },
    message: {
      chainId: Number(authorization.chainId),
      address: authorization.address,
      nonce: Number(authorization.nonce),
    },
  };
}

export function validateCodeAddress(address: string): boolean {
  try {
    return isAddress(address) && address !== zeroAddress;
  } catch {
    return false;
  }
}

export function validateChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

export function validateNonce(nonce: number): boolean {
  return Number.isInteger(nonce) && nonce >= 0;
}

export function formatAuthorizationForSigning(
  codeAddress: string,
  chainId: number,
  nonce: number,
): Eip7702Authorization {
  return {
    chainId: BigInt(chainId),
    address: codeAddress,
    nonce: BigInt(nonce),
  };
}

export function parseSignature(signature: Hex): {
  yParity: number;
  r: Hex;
  s: Hex;
} {
  const { v, r, s } = viemParseSignature(signature);
  return {
    yParity: v === 28n ? 1 : 0, // Convert v to yParity (27/28 -> 0/1)
    r,
    s,
  };
}

export async function recoverAuthorizationSigner(
  authorization: Eip7702Authorization,
  signature: Hex,
  chainId: number = 1,
): Promise<string> {
  const typedData = createEip7702TypedData(authorization, chainId);

  return (await verifyTypedData({
    domain: typedData.domain as any,
    types: { Authorization: typedData.types.Authorization },
    primaryType: 'Authorization',
    message: typedData.message,
    signature,
  } as any))
    ? 'true'
    : 'false';
}

export function createAuthorizationHash(
  authorization: Eip7702Authorization,
  chainId: number = 1,
): Hex {
  const typedData = createEip7702TypedData(authorization, chainId);

  return hashTypedData({
    domain: typedData.domain as any,
    types: { Authorization: typedData.types.Authorization },
    primaryType: 'Authorization',
    message: typedData.message,
  });
}

export const DEFAULT_TEMPLATES: AuthorizationTemplate[] = [
  {
    id: 'multisig-2of3',
    name: '2-of-3 Multisig',
    description: 'Requires 2 signatures out of 3 authorized signers',
    codeAddress: '0x1234567890123456789012345678901234567890',
    category: 'multisig',
    isVerified: true,
  },
  {
    id: 'timelock-1day',
    name: '1 Day Timelock',
    description: 'Delays execution by 24 hours for security',
    codeAddress: '0x2345678901234567890123456789012345678901',
    category: 'timelock',
    isVerified: true,
  },
  {
    id: 'proxy-upgradeable',
    name: 'Upgradeable Proxy',
    description: 'Allows account logic to be upgraded',
    codeAddress: '0x3456789012345678901234567890123456789012',
    category: 'proxy',
    isVerified: true,
  },
];

export function getTemplateById(id: string): AuthorizationTemplate | undefined {
  return DEFAULT_TEMPLATES.find((template) => template.id === id);
}

export function formatAuthorizationTuple(
  authorization: Eip7702AuthorizationSigned,
): string {
  return `(${authorization.chainId}, ${authorization.address}, ${authorization.nonce}, ${authorization.yParity}, ${authorization.r}, ${authorization.s})`;
}
