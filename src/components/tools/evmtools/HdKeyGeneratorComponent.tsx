import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shadcn-components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn-components/ui/select';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc);

const HdKeyGeneratorComponent: React.FC = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [coinType, setCoinType] = useState('60'); // EVM by default
  const [account, setAccount] = useState(0);
  const [addresses, setAddresses] = useState<
    Array<{ path: string; publicKey: string; privateKey: string }>
  >([]);

  const generateAddresses = useCallback(
    (mnemonic: string, account: number, coinType: string) => {
      const seed = mnemonicToSeedSync(mnemonic);

      const root = bip32.fromSeed(seed);
      const derivedAddresses = [];

      for (let i = 0; i < 10; i++) {
        const path = `m/44'/${coinType}'/${account}'/0/${i}`;
        const node = root.derivePath(path);
        derivedAddresses.push({
          path,
          publicKey: node.publicKey.toString('hex'),
          privateKey: node.privateKey!.toString('hex'),
        });
      }

      setAddresses(derivedAddresses);
    },
    [],
  );
  const generateRandomMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    generateAddresses(newMnemonic, account, coinType);
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAccount = parseInt(event.target.value, 10);
    setAccount(newAccount);
    generateAddresses(mnemonic, newAccount, coinType);
  };

  const handleCoinTypeChange = (value: string) => {
    setCoinType(value);
    generateAddresses(mnemonic, account, value);
  };

  const loadMoreAddresses = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const currentCount = addresses.length;
    const newAddresses = [];

    for (let i = currentCount; i < currentCount + 10; i++) {
      const path = `m/44'/${coinType}'/${account}'/0/${i}`;
      const node = root.derivePath(path);
      newAddresses.push({
        path,
        publicKey: node.publicKey.toString('hex'),
        privateKey: node.privateKey!.toString('hex'),
      });
    }

    setAddresses([...addresses, ...newAddresses]);
  };

  useEffect(() => {
    if (mnemonic) {
      generateAddresses(mnemonic, account, coinType);
    }
  }, [mnemonic, account, coinType, generateAddresses]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">HD Key Generator</h2>

      <div className="mb-4">
        <label className="block mb-2">Mnemonic Phrase:</label>
        <p className="text-xs">
          * We do not recommend to use these keys to store mainnet funds
        </p>
        <Input
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          className="mb-2"
        />
        <Button onClick={generateRandomMnemonic} className="w-full">
          Generate Random Mnemonic
        </Button>
      </div>

      <div className="mb-4">
        <label className="block mb-2">BIP44 Derivation Path:</label>
        <div className="flex items-center space-x-2">
          <span>m/44&apos;/</span>
          <Select onValueChange={handleCoinTypeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue
                placeholder={coinType === '60' ? 'EVM (60)' : 'Bitcoin (0)'}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="60">EVM (60)</SelectItem>
                <SelectItem value="0">Bitcoin (0)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>&apos;/</span>
          <Input
            type="number"
            value={account}
            onChange={handleAccountChange}
            className="w-16 mb-2"
          />
          <span>&apos;/0/i</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Derived Addresses</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Derivation Path</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Private Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((addr, index) => (
              <TableRow key={index}>
                <TableCell>{addr.path}</TableCell>
                <TableCell>{addr.publicKey}</TableCell>
                <TableCell>{addr.privateKey}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={loadMoreAddresses} className="w-full mt-4">
          Generate 10 More Addresses
        </Button>
      </div>
    </div>
  );
};

export default HdKeyGeneratorComponent;
