import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';

function SuccessCustomIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 5.917 5.724 10.5 15 1.5"
      />
    </svg>
  );
}

function CopyCustomIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 20"
    >
      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
    </svg>
  );
}
export default function EvmAddressChecksumComponent() {
  const [toChecksumAddress, setToChecksumAddress] = useState<string>('');
  const [checksummedAddress, setChecksummedAddress] = useState<string>('');
  const [isChecksumAddress, setIsChecksumAddress] = useState<string>('');

  const toast = useToast();

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
        status: 'success',
      });
    }
  };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex flex-col w-96">
      <div className="mb-8">
        <Label className="mb-4">toChecksumAddress</Label>
        <Input
          type="string"
          placeholder="address"
          className="min-w-96"
          value={toChecksumAddress}
          onChange={handleToChecksumAddress}
        />
        <div className="w-full">
          <div className="relative">
            <Input
              type="string"
              className="min-w-96 mt-4"
              value={checksummedAddress}
              disabled
            />
            <button
              data-copy-to-clipboard-target="npm-install-copy-button"
              data-tooltip-target="tooltip-copy-npm-install-copy-button"
              className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              onClick={() => {
                if (
                  toChecksumAddress == null ||
                  toChecksumAddress.length == 0
                ) {
                  return;
                }
                handleCopyClick(ethers.utils.getAddress(toChecksumAddress));
              }}
            >
              <span id="default-icon">
                <CopyCustomIcon />
              </span>
              <span
                id="success-icon"
                className="hidden inline-flex items-center"
              >
                <SuccessCustomIcon />
              </span>
            </button>
            <div
              id="tooltip-copy-npm-install-copy-button"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              <span id="default-tooltip-message">Copy to clipboard</span>
              <span id="success-tooltip-message" className="hidden">
                Copied!
              </span>
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Label className="mb-4">isChecksumAddress</Label>
        <Input
          type="email"
          className="min-w-28 min-w-96"
          placeholder="address"
          value={isChecksumAddress}
          onChange={handleIsChecksumAddress}
        />
      </div>
    </div>
  );
}
