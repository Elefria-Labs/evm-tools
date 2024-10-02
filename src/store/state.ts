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
  // Ext
  lastOpenTab: string;
  setLastOpenTab: (lastOpenTab: string) => void;
  pinnedTabs: string[];
  setPinnedTabs: (tabs: string[]) => void;
}
