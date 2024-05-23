import React, { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import InputBaseCopy from '@components/common/BaseInputCopy';

export default function EvmAddressChecksumComponent() {
  const [toChecksumAddress, setToChecksumAddress] = useState<string>('');
  const [checksummedAddress, setChecksummedAddress] = useState<string>('');
  const [isChecksumAddress, setIsChecksumAddress] = useState<string>('');

  const { toast } = useToast();

  // const isChecksumAddressFn = (address: string) => {
  //   if (!ethers.utils.isAddress(address)) {
  //     toast({
  //       ...toastOptions,
  //       title: 'Invalid address',
  //     });
  //     return;
  //   }
  // };
  // const debFn = debounce(isChecksumAddressFn, 1000);

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleToChecksumAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const addressInput = event.target.value;
    setToChecksumAddress(addressInput);
    if (!ethers.utils.isAddress(addressInput)) {
      toast({
        ...toastOptions,
        title: 'Invalid address',
      });
      return;
    }

    setChecksummedAddress(ethers.utils.getAddress(addressInput));
  };

  const handleIsChecksumAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const addressInput = event.target.value;
    setIsChecksumAddress(addressInput);
    if (!ethers.utils.isAddress(addressInput)) {
      toast({
        ...toastOptions,
        title: 'Invalid address',
      });
      return;
    }

    let addr;
    try {
      addr = ethers.utils.getAddress(addressInput);
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Not a checksum address!',
      });
      return;
    }

    if (addr.trim() != addressInput.trim()) {
      toast({
        ...toastOptions,
        title: 'Not a checksum address!',
      });
    } else {
      toast({
        ...toastOptions,
        title: 'Valid checksum address!',
        variant: 'default',
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <Label className="mb-4">toChecksumAddress</Label>
        <Input
          type="string"
          placeholder="address"
          value={toChecksumAddress}
          onChange={handleToChecksumAddress}
        />
        {checksummedAddress && (
          <InputBaseCopy
            value={checksummedAddress}
            disabled
            onClick={() => {
              if (toChecksumAddress == null || toChecksumAddress.length == 0) {
                return;
              }
              handleCopyClick(ethers.utils.getAddress(toChecksumAddress));
            }}
          />
        )}
      </div>
      <div className="w-full">
        <Label className="mb-4">isChecksumAddress</Label>
        <Input
          type="email"
          className="min-w-28"
          placeholder="address"
          value={isChecksumAddress}
          onChange={handleIsChecksumAddress}
        />
      </div>
    </div>
  );
}
