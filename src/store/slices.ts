import { StoreApi } from 'zustand';
import {
  ContractEncoderAbi,
  GlobalState,
  ReadWriteUserContract,
} from './state';

export const createChecksumAddressSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  _: StoreApi<unknown>,
) => ({
  toChecksumAddress: '',
  setToChecksumAddress: (address: string) =>
    set((state) => ({ ...state, toChecksumAddress: address })),
});

export const createMimicWalletSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  _: StoreApi<unknown>,
) => ({
  addressToMimic: '',
  wcUri: '',
  setAddressToMimic: (address: string) =>
    set(() => ({ addressToMimic: address })),
  setWcUri: (uri: string) => set(() => ({ wcUri: uri })),
});

export const createExtensionSettingsSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  _: StoreApi<unknown>,
) => ({
  lastOpenTab: '',
  setLastOpenTab: (lastOpenTab: string) =>
    set(() => ({ lastOpenTab: lastOpenTab })),
  pinnedTabs: [],
  setPinnedTabs: (tabs: string[]) => set({ pinnedTabs: tabs }),
});

export const createBitManipulationSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  _: StoreApi<unknown>,
) => ({
  bitManipulation: {
    binaryValue: '',
    maskValue: '',
    shiftedValue: '',
  },
  setBinaryValue: (binaryValue: string) =>
    set((state) => ({
      bitManipulation: { ...state.bitManipulation, binaryValue },
    })),
  setMaskValue: (maskValue: string) =>
    set((state) => ({
      bitManipulation: { ...state.bitManipulation, maskValue },
    })),
  setShiftedValue: (shiftedValue: string) =>
    set((state) => ({
      bitManipulation: { ...state.bitManipulation, shiftedValue },
    })),
});

export const createReadWriteContractUiSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  _: StoreApi<unknown>,
) => ({
  readWriteUserContracts: [
    {
      id: '1',
      address: '0xc3De830EA07524a0761646a6a4e4be0e114a3C83',

      abi: '',
      parsedAbi: null,
      parseError: '',
      contractAbi: null,
      abiError: null,
    },
  ],
  setReadWriteUserContracts: (rwUserContract: ReadWriteUserContract[]) =>
    set((state) => ({
      ...state,
      readWriteUserContracts: rwUserContract,
    })),
});

export const createAbiEncoderUiSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  _get: () => unknown,
  _: StoreApi<unknown>,
) => ({
  contractEncoderAbi: {
    contractAbi: [],
  },
  setContractEncoderAbi: (userContractAbi: ContractEncoderAbi) =>
    set((state) => ({
      ...state,
      contractEncoderAbi: userContractAbi,
    })),
});
