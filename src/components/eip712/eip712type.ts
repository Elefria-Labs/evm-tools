import { ethers } from 'ethers';

export type Eip712MessageType = {
  from: string;
  to: string;
  value: number;
  gas: number;
  nonce: number;
  data: string;
};

export type Data712Type = {
  types: {
    EIP712Domain: [
      {
        name: 'name';
        type: 'string';
      },
      {
        name: 'version';
        type: 'string';
      },
      {
        name: 'chainId';
        type: 'uint256';
      },
      {
        name: 'verifyingContract';
        type: 'address';
      },
    ];
    SampleTx: [
      { name: 'from'; type: 'address' },
      { name: 'to'; type: 'address' },
      { name: 'value'; type: 'uint256' },
      { name: 'gas'; type: 'uint256' },
      { name: 'nonce'; type: 'uint256' },
      { name: 'data'; type: 'bytes' },
    ];
  };
  primaryType: 'SampleTx';
  domain: {
    name: 'ZkBlock.app';
    version: '1';
    chainId: 1;
    verifyingContract: string;
  };
  message: Eip712MessageType;
};

export const getEip721MetaTx = (
  message: Eip712MessageType,
): GenericData712Type<
  Record<string, string | number>,
  Record<string, string>
> => {
  return {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      SampleTx: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
    },
    primaryType: 'SampleTx',
    domain: {
      name: 'ZkBlock.app',
      version: '1',
      chainId: 1,
      verifyingContract: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
    },
    // @ts-ignore TODO
    message: message,
  };
};
export type Eip712MessageType2 = {
  message: string;
  tnc: string;
  nonce: string;
  issuedAt: string;
};
export type Data712Type2 = {
  types: {
    EIP712Domain: [
      {
        name: 'name';
        type: 'string';
      },
      {
        name: 'version';
        type: 'string';
      },
      {
        name: 'chainId';
        type: 'uint256';
      },
    ];
    TestWalletMessage: [
      { name: 'message'; type: 'string' },
      { name: 'tnc'; type: 'string' },
      { name: 'nonce'; type: 'string' },
      { name: 'issuedAt'; type: 'string' },
    ];
  };
  primaryType: 'TestWalletMessage';
  domain: {
    name: 'Test';
    version: '0.2';
    chainId: 1337;
  };
  message: Eip712MessageType2;
};
export const getData7122 = (message: Eip712MessageType2): Data712Type2 => {
  return {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
      ],
      TestWalletMessage: [
        { name: 'message', type: 'string' },
        { name: 'tnc', type: 'string' },
        { name: 'nonce', type: 'string' },
        { name: 'issuedAt', type: 'string' },
      ],
    },
    primaryType: 'TestWalletMessage',
    domain: {
      name: 'Test',
      version: '0.2',
      chainId: 1337,
    },
    message: message,
  };
};

export type GenericData712Type<T, K> = {
  types: Record<string, { name: string; type: string }[]>;
  primaryType: string;
  domain: T;
  message: K;
};
export function getSpecific712Data<T, K>(
  types: Record<string, { name: string; type: string }[]>,
  primaryType: string,
  domain: T,
  eip712Message: K,
): GenericData712Type<T, K> {
  return {
    types,
    domain,
    primaryType,
    message: eip712Message,
  };
}

export const eip712MetaTxMessage: Eip712MessageType = {
  from: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
  to: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
  value: 100000,
  data: '0x',
  nonce: 1,
  gas: 100000,
};

export function getEip712AaveCreditDelegation(): GenericData712Type<
  Record<string, string | number>,
  Record<string, string>
> {
  const chainId = 11155111; // SEPOLIA_CHAIN_ID
  const token = '0x978A3dE9DB0150948568941FE380603051072222'; // GHO_DEBT_TOKEN_ADDR_SEPOLIA
  const revision = '1';
  const tokenName = 'Aave Variable Debt Sepolia GHO';

  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      DelegationWithSig: [
        { name: 'delegatee', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'DelegationWithSig',
    domain: {
      name: tokenName,
      version: revision,
      chainId: chainId,
      verifyingContract: token,
    },
    message: {
      delegatee: '0x18D365087Eb68362c7E62792953fB209703541fE',
      value: ethers.utils.parseEther('0.1').toString(),
      nonce: String(1),
      deadline: '1819258295',
    },
  };
}

export function getPermit2Template(): GenericData712Type<
  Record<string, string | number>,
  Record<string, string | number>
> {
  return {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    domain: {
      name: 'MyToken',
      version: '1',
      chainId: 1,
      verifyingContract: ethers.constants.AddressZero, // Replace with your token contract address
    },
    message: {
      owner: ethers.constants.AddressZero, // Replace with the owner address
      spender: ethers.constants.AddressZero, // Replace with the spender address
      value: 1000, // Amount to be allowed
      nonce: 0, // Nonce for the permit
      deadline: Math.floor(Date.now() / 1000) + 3600, // Current time + 1 hour in seconds
    },
  };
}

export function getEip721DataByTemplate(
  eip721Template: string,
): GenericData712Type<
  Record<string, string | number>,
  Record<string, string | number>
> {
  switch (eip721Template) {
    case 'meta-tx':
      return getEip721MetaTx(eip712MetaTxMessage);
    case 'aave-delegate-credit':
      return getEip712AaveCreditDelegation();
    case 'permit2':
      return getPermit2Template();
    default:
      return { types: {}, domain: {}, primaryType: '', message: {} };
  }
}
