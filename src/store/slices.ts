import { StoreApi } from 'zustand';
import {
  AbiCacheItem,
  ContractEncoderAbi,
  GlobalState,
  ReadWriteUserContract,
  RecentAddress,
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

export const createAbiCacheSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  get: () => GlobalState,
  _: StoreApi<unknown>,
) => ({
  abiCache: [] as AbiCacheItem[],
  saveAbiToCache: (address: string, chainId: number, abi: any[]) =>
    set((state) => {
      const key = `${address.toLowerCase()}-${chainId}`;
      const existingIndex = state.abiCache.findIndex(
        (item) => `${item.address.toLowerCase()}-${item.chainId}` === key,
      );
      const newItem: AbiCacheItem = {
        address: address.toLowerCase(),
        chainId,
        abi,
        timestamp: Date.now(),
      };

      if (existingIndex >= 0) {
        const updatedCache = [...state.abiCache];
        updatedCache[existingIndex] = newItem;
        return { abiCache: updatedCache };
      } else {
        return { abiCache: [...state.abiCache, newItem] };
      }
    }),
  loadAbiFromCache: (address: string, chainId: number): any[] | null => {
    const state = get();
    const key = `${address.toLowerCase()}-${chainId}`;
    const cachedItem = state.abiCache.find(
      (item) => `${item.address.toLowerCase()}-${item.chainId}` === key,
    );
    return cachedItem ? cachedItem.abi : null;
  },
  clearAbiFromCache: (address: string, chainId: number) =>
    set((state) => {
      const key = `${address.toLowerCase()}-${chainId}`;
      return {
        abiCache: state.abiCache.filter(
          (item) => `${item.address.toLowerCase()}-${item.chainId}` !== key,
        ),
      };
    }),
});

export const createRecentAddressesSlice = (
  set: (
    partial:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void,
  get: () => GlobalState,
  _: StoreApi<unknown>,
) => ({
  recentAddresses: [
    {
      address: '0x253553366Da8546fC250F225fe3d25d0C782303b',
      chainId: 1,
      timestamp: 0,
    },
  ] as RecentAddress[],
  addRecentAddress: (address: string, chainId: number) =>
    set((state) => {
      const normalizedAddress = address.toLowerCase();
      // Remove existing entry if it exists
      const filtered = state.recentAddresses.filter(
        (item) =>
          !(
            item.address.toLowerCase() === normalizedAddress &&
            item.chainId === chainId
          ),
      );
      // Add to front of list
      const newItem: RecentAddress = {
        address: normalizedAddress,
        chainId,
        timestamp: Date.now(),
      };
      // Keep only last 8 items
      const updated = [newItem, ...filtered].slice(0, 8);
      return { recentAddresses: updated };
    }),
  getRecentAddresses: (chainId: number): RecentAddress[] => {
    const state = get();
    return state.recentAddresses
      .filter((item) => item.chainId === chainId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
  },
  removeRecentAddress: (address: string, chainId: number) =>
    set((state) => {
      const normalizedAddress = address.toLowerCase();
      return {
        recentAddresses: state.recentAddresses.filter(
          (item) =>
            !(
              item.address.toLowerCase() === normalizedAddress &&
              item.chainId === chainId
            ),
        ),
      };
    }),
});
