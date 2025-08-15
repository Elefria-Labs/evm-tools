export interface Eip7702Authorization {
  chainId: bigint;
  address: string;
  nonce: bigint;
}

export interface Eip7702AuthorizationSigned extends Eip7702Authorization {
  yParity: number;
  r: string;
  s: string;
}

export interface Eip7702Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract?: string;
}

export interface Eip7702TypedData {
  types: {
    EIP712Domain: Array<{ name: string; type: string }>;
    Authorization: Array<{ name: string; type: string }>;
  };
  primaryType: 'Authorization';
  domain: Eip7702Domain;
  message: {
    chainId: number;
    address: string;
    nonce: number;
  };
}

export interface AuthorizationTemplate {
  id: string;
  name: string;
  description: string;
  codeAddress: string;
  category: 'multisig' | 'timelock' | 'proxy' | 'custom';
  isVerified: boolean;
}

export interface AccountAuthorizationStatus {
  account: string;
  authorizedCode?: string;
  isAuthorized: boolean;
  authorizationHistory: AuthorizationHistoryItem[];
}

export interface AuthorizationHistoryItem {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  type: 'authorize' | 'revoke';
  codeAddress: string;
  nonce: number;
}

export interface Eip7702Error {
  code: string;
  message: string;
  details?: any;
}

export type AuthorizationStatus =
  | 'idle'
  | 'signing'
  | 'pending'
  | 'success'
  | 'error';
