import { create } from 'zustand';
import { createChecksumAddressSlice, createMimicWalletSlice } from './slices';
import { createSelectors } from './selectors';
import { GlobalState } from './state';
import { persist, createJSONStorage } from 'zustand/middleware';

// export const useGlobalStore = create(
//   persist(createChecksumAddressSlice(...a), {
//     name: 'food-storage', // name of the item in the storage (must be unique)
//     storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
//   }),
// );

const useGlobalStoreBase = create<GlobalState>((...a) => ({
  ...createChecksumAddressSlice(...a),
  ...createMimicWalletSlice(...a),
}));

const usePersistGlobalStoreBase = create<GlobalState>()(
  persist(
    (...a) => ({
      ...createChecksumAddressSlice(...a),
      ...createMimicWalletSlice(...a),
    }),
    {
      name: 'evm-tools', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

const isAllowPersist = true;
export const useGlobalStore = isAllowPersist
  ? createSelectors(usePersistGlobalStoreBase)
  : createSelectors(useGlobalStoreBase);
