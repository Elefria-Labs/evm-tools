import React, { useEffect, useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@shadcn-components/ui/table';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from '@shadcn-components/ui/menubar';
import { ethers } from 'ethers';
import { TrashIcon } from '@radix-ui/react-icons';
import { handleCopyClick } from '@utils/wallet';
import { useToast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import EthereumIcon from '@components/icon/ethereum';
import PolygonIcon from '@components/icon/polygon';
import OptimismIcon from '@components/icon/optimism';
import ArbitrumIcon from '@components/icon/arbitrum';
import BaseIcon from '@components/icon/base';
import BscIcon from '@components/icon/bsc';

interface AddressBookEntry {
  tag: string;
  address: string;
}
type AddressBookComponentPropsType = {
  onlyAddressBook?: boolean;
};

function AddressBookComponent(props: AddressBookComponentPropsType) {
  const [tag, setTag] = useState('');
  const [address, setAddress] = useState('');
  const { toast } = useToast();
  const [addressBook, setAddressBook] = useState<AddressBookEntry[]>([]);

  const getAddressBook = async () => {
    const storedAddressBook = localStorage.getItem('addressBook');
    if (storedAddressBook) {
      setAddressBook(JSON.parse(storedAddressBook ?? '[]'));
    }
  };

  useEffect(() => {
    getAddressBook();
  }, []);

  const handleAdd = () => {
    if (ethers.isAddress(address)) {
      const newEntry = { tag, address };
      const updatedAddressBook = [...addressBook, newEntry];
      setAddressBook(updatedAddressBook);
      localStorage.setItem('addressBook', JSON.stringify(updatedAddressBook));
      setTag('');
      setAddress('');
    } else {
      toast({
        ...toastOptions,
        title: 'Invalid Ethereum address!',
      });
    }
  };

  const handleDelete = (index: number) => {
    const updatedAddressBook = addressBook.filter((_, i) => i !== index);
    setAddressBook(updatedAddressBook);
    localStorage.setItem('addressBook', JSON.stringify(updatedAddressBook));
  };

  const handleCopy = (address: string) => {
    handleCopyClick(address);
    toast({
      ...toastOptions,
      title: 'Copied!',
      variant: 'default',
    });
  };

  const handleOpenInExplorer = (address: string, chain: string) => {
    let url = '';
    switch (chain) {
      case 'Ethereum':
        url = `https://etherscan.io/address/${address}`;
        break;
      case 'Polygon':
        url = `https://polygonscan.com/address/${address}`;
        break;
      case 'Optimism':
        url = `https://optimistic.etherscan.io/address/${address}`;
        break;
      case 'Arbitrum':
        url = `https://arbiscan.io/address/${address}`;
        break;
      case 'Base':
        url = `https://basescan.org/address/${address}`;
        break;
      case 'Bsc':
        url = `https://bscscan.com/address/${address}`;
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[480px] w-[100%]">
        {props?.onlyAddressBook !== true && (
          <div className="mb-8">
            <Input
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button className="w-full" onClick={handleAdd}>
              Add
            </Button>
          </div>
        )}
        <p className="mb-2 text-md font-bold">Your Address Book</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addressBook.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.tag}</TableCell>
                <TableCell>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="text-xs">
                        {entry.address}
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem
                          className="cursor-pointer"
                          onClick={() => handleCopy(entry.address)}
                        >
                          Copy
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                          {[
                            { Icon: EthereumIcon, name: 'Ethereum' },
                            { Icon: BaseIcon, name: 'Base' },
                            { Icon: OptimismIcon, name: 'Optimism' },
                            { Icon: ArbitrumIcon, name: 'Arbitrum' },
                            { Icon: PolygonIcon, name: 'Polygon' },
                            { Icon: BscIcon, name: 'Bsc' },
                          ].map(({ Icon, name }, i) => (
                            <Icon
                              key={i}
                              className="h-[24px] w-[24px] mr-2 cursor-pointer"
                              onClick={() =>
                                handleOpenInExplorer(entry.address, name)
                              }
                            />
                          ))}
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </TableCell>
                <TableCell>
                  <TrashIcon
                    className="cursor-pointer"
                    onClick={() => handleDelete(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AddressBookComponent;
