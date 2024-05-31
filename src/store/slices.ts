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

// interface ChecksumAddressSlice {
//   toChecksumAddress: string;
//   setToChecksumAddress: (address: string) => void;
// }

// const useBearStoreBase = create<ChecksumAddressSlice>()((set) => ({
//   toChecksumAddress: '',
//   setToChecksumAddress: (address: string) =>
//     set(() => ({ toChecksumAddress: address })),
// }));

// // const createChecksumAddressSliceBase = create<>() (
// //   set: (partial: unknown, replace?: boolean | undefined) => void,
// //   _: () => unknown,
// //   // eslint-disable-next-line @typescript-eslint/no-redeclare
// //   _: StoreApi<unknown>,
// // ) => ({
// //   toChecksumAddress: '',
// //   setToChecksumAddress: (address: string) =>
// //     set(() => ({ toChecksumAddress: address })),
// // });

// export const useChecksumAddressSlice = createSelectors(useBearStoreBase);
