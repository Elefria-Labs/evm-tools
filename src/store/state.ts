export interface GlobalState {
  toChecksumAddress: string;
  setToChecksumAddress: (address: string) => void;
  addressToMimic: string;
  setAddressToMimic: (address: string) => void;
  wcUri: string;
  setWcUri: (wcUri: string) => void;

  // Ext
  lastOpenTab: string;
  setLastOpenTab: (lastOpenTab: string) => void;
  pinnedTabs: string[];
  setPinnedTabs: (tabs: string[]) => void;
}
