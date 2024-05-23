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
import { ethers } from 'ethers';
import { TrashIcon } from '@radix-ui/react-icons';

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
  const [addressBook, setAddressBook] = useState<AddressBookEntry[]>([]);

  const getAddressBook = async () => {
    const storedAddressBook = localStorage.getItem('addressBook');
    if (storedAddressBook) {
      setAddressBook(JSON.parse(storedAddressBook ?? []));
    }
  };

  useEffect(() => {
    getAddressBook();
  }, []);

  const handleAdd = () => {
    if (ethers.utils.isAddress(address)) {
      const newEntry = { tag, address };
      const updatedAddressBook = [...addressBook, newEntry];
      setAddressBook(updatedAddressBook);
      localStorage.setItem('addressBook', JSON.stringify(updatedAddressBook));
      setTag('');
      setAddress('');
    } else {
      alert('Invalid Ethereum address');
    }
  };

  const handleDelete = (index: number) => {
    const updatedAddressBook = addressBook.filter((_, i) => i !== index);
    setAddressBook(updatedAddressBook);
    localStorage.setItem('addressBook', JSON.stringify(updatedAddressBook));
  };

  return (
    <div>
      <div className="max-w-[480px] w-[100%]">
        {props?.onlyAddressBook != true && (
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
            <Button className="w-full" onClick={() => handleAdd()}>
              Add
            </Button>
          </div>
        )}
        {/* <ul>
        {addressBook.map((entry, index) => (
          <li key={index}>
            <span>
              {entry.tag} - {entry.address}
            </span>

            <TrashIcon onClick={() => handleDelete(index)} />
          </li>
        ))}
      </ul> */}
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
                  {entry.address}
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={(event) => {
                          const target = event.currentTarget;
                          target.blur();
                          target.focus();
                          handleCopyClick(entry.address);
                        }}
                      >
                       
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copied</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}
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
