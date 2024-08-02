import React, { useCallback, useEffect, useState } from 'react';

import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { ethers } from 'ethers';
import { useToast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';

type AddressToBinaryProps = {
  address?: string;
};
function AddressToBinary(props: AddressToBinaryProps) {
  const [address, setAddress] = useState('');
  const [binaryAddress, setBinaryAddress] = useState('');
  const { toast } = useToast();

  const convertToBinary = (hex: string): string => {
    const bigInt = ethers.BigNumber.from(hex).toBigInt();
    // Ensure 160 bits (40 hex chars * 4)
    let binary = bigInt.toString(2).padStart(160, '0');

    // Group into sets of 4 bits
    return binary.match(/.{1,4}/g)?.join(' ') ?? '';
  };

  useEffect(() => {
    if (props?.address) {
      setAddress(props?.address);
    }
  }, [props?.address]);

  const handleConvert = useCallback(() => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast({ ...toastOptions, title: 'Please enter a valid EVM address' });

      return;
    }
    const binary = convertToBinary(address);

    setBinaryAddress(binary);
  }, [address, toast]);

  useEffect(() => {
    if (ethers.utils.isAddress(address)) {
      handleConvert();
    }
  }, [address, handleConvert]);

  return (
    <div className="space-y-4">
      {props?.address == null && (
        <>
          <Input
            placeholder="Enter EVM address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />

          <Button onClick={handleConvert} className="w-full">
            Convert to Binary
          </Button>
        </>
      )}
      {binaryAddress && (
        <div className="mt-4 mb-8 p-2 bg-gray-800 rounded-md overflow-x-auto">
          <pre className="text-blue-300 font-mono text-sm whitespace-pre-wrap break-all">
            {binaryAddress}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AddressToBinary;
