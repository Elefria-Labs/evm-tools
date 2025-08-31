export interface ReadWriteUserContract {
  id: string;
  address: string;
  abi: string;
  parsedAbi: null | any[];
  parseError: string;
  contractAbi: null | any[];
  abiError: null | string;
}

interface AbiItem {
  type: string;
  name?: string;
  inputs?: { name: string; type: string }[];
}

export interface ContractEncoderAbi {
  contractAbi: AbiItem[];
}

export interface AbiCacheItem {
  address: string;
  chainId: number;
  abi: any[];
  timestamp: number;
}

export interface RecentAddress {
  address: string;
  chainId: number;
  timestamp: number;
}

export interface GlobalState {
  toChecksumAddress: string;
  setToChecksumAddress: (address: string) => void;
  addressToMimic: string;
  setAddressToMimic: (address: string) => void;
  wcUri: string;
  setWcUri: (wcUri: string) => void;
  bitManipulation: {
    binaryValue: string;
    maskValue: string;
    shiftedValue: string;
  };
  setBinaryValue: (binaryValue: string) => void;
  setMaskValue: (maskValue: string) => void;
  setShiftedValue: (shiftedValue: string) => void;
  // read write contract ui
  readWriteUserContracts: ReadWriteUserContract[];
  setReadWriteUserContracts: (
    readWriteUserContracts: ReadWriteUserContract[],
  ) => void;

  // abi encoder
  contractEncoderAbi: ContractEncoderAbi;
  setContractEncoderAbi: (contractEncoderAbi: ContractEncoderAbi) => void;

  // abi cache
  abiCache: AbiCacheItem[];
  saveAbiToCache: (address: string, chainId: number, abi: any[]) => void;
  loadAbiFromCache: (address: string, chainId: number) => any[] | null;
  clearAbiFromCache: (address: string, chainId: number) => void;

  // recent addresses
  recentAddresses: RecentAddress[];
  addRecentAddress: (address: string, chainId: number) => void;
  getRecentAddresses: (chainId: number) => RecentAddress[];
  removeRecentAddress: (address: string, chainId: number) => void;

  // Ext
  lastOpenTab: string;
  setLastOpenTab: (lastOpenTab: string) => void;
  pinnedTabs: string[];
  setPinnedTabs: (tabs: string[]) => void;
}
