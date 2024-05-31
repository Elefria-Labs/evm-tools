import { StoreApi } from 'zustand';
import { GlobalState } from './state';

export const createChecksumAddressSlice = (
  set: (partial: Partial<GlobalState>, replace?: boolean | undefined) => void,
  _get: () => unknown,
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  _: StoreApi<unknown>,
) => ({
  toChecksumAddress: '',
  setToChecksumAddress: (address: string) =>
    set(() => ({ toChecksumAddress: address })),
});

export const createMimicWalletSlice = (
  set: (partial: Partial<GlobalState>, replace?: boolean | undefined) => void,
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
  set: (partial: Partial<GlobalState>, replace?: boolean | undefined) => void,
  _get: () => unknown,
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  _: StoreApi<unknown>,
) => ({
  lastOpenTab: '',
  setLastOpenTab: (lastOpenTab: string) =>
    set(() => ({ lastOpenTab: lastOpenTab })),
});
