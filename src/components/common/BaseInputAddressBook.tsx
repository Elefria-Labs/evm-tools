import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Pencil2Icon, CheckCircledIcon, CopyIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shadcn-components/ui/popover';
import AddressBookComponent from '@components/tools/evmtools/AddressBookComponent';
import { handleCopyClick } from '@utils/wallet';
import { cn } from '@lib/utils';

export default function BaseInputAddressBook(props: {
  onClick?: (value: any) => void;
  onChange?: (value: any) => void;
  value: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [isTextCopied, setIsTextCopied] = useState<boolean>(false);

  const copyText = useCallback(() => {
    setIsTextCopied((prevIsOn) => !prevIsOn);
  }, []);
  useEffect(() => {
    if (!isTextCopied) {
      return;
    }
    const intervalId = setInterval(copyText, 3000); // Toggle every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isTextCopied, copyText]);
  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type="string"
          className={cn('mt-4', props?.className)}
          value={props.value}
          onChange={props?.onChange}
          disabled={props?.disabled}
          placeholder={props?.placeholder}
        />
        <button
          data-copy-to-clipboard-target="npm-install-copy-button"
          data-tooltip-target="tooltip-copy-npm-install-copy-button"
          className="absolute end-8 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
          onClick={() => {
            handleCopyClick(props?.value ?? '');
            setIsTextCopied(true);
          }}
        >
          {isTextCopied ? (
            <span id="success-icon" className="inline-flex items-center">
              <CheckCircledIcon className="text-green-400" />
            </span>
          ) : (
            <span id="default-icon">
              <CopyIcon />
            </span>
          )}
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              data-copy-to-clipboard-target="npm-install-copy-button"
              data-tooltip-target="tooltip-copy-npm-install-copy-button"
              className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              onClick={props.onClick}
            >
              <span id="default-icon">
                <Pencil2Icon />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <AddressBookComponent onlyAddressBook={true} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
