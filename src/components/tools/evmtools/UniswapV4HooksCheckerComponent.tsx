import React, { useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import { Button } from '@shadcn-components/ui/button';
import { toast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shadcn-components/ui/tooltip';
import { ethers } from 'ethers';
import { CheckIcon, Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import AddressToBinary from './HooksChecker/AddressToBinary';

const BEFORE_INITIALIZE_FLAG = 1n << 13n;
const AFTER_INITIALIZE_FLAG = 1n << 12n;
const BEFORE_ADD_LIQUIDITY_FLAG = 1n << 11n;
const AFTER_ADD_LIQUIDITY_FLAG = 1n << 10n;
const BEFORE_REMOVE_LIQUIDITY_FLAG = 1n << 9n;
const AFTER_REMOVE_LIQUIDITY_FLAG = 1n << 8n;
const BEFORE_SWAP_FLAG = 1n << 7n;
const AFTER_SWAP_FLAG = 1n << 6n;
const BEFORE_DONATE_FLAG = 1n << 5n;
const AFTER_DONATE_FLAG = 1n << 4n;
const BEFORE_SWAP_RETURNS_DELTA_FLAG = 1n << 3n;
const AFTER_SWAP_RETURNS_DELTA_FLAG = 1n << 2n;
const AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG = 1n << 1n;
const AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG = 1n << 0n;

const hooksInfo: Record<string, string> = {
  BEFORE_INITIALIZE:
    'uint160 internal constant BEFORE_INITIALIZE_FLAG = 1 << 13',
  AFTER_INITIALIZE: 'uint160 internal constant AFTER_INITIALIZE_FLAG = 1 << 12',
  BEFORE_ADD_LIQUIDITY:
    'uint160 internal constant BEFORE_ADD_LIQUIDITY_FLAG = 1 << 11',
  AFTER_ADD_LIQUIDITY:
    'uint160 internal constant AFTER_ADD_LIQUIDITY_FLAG = 1 << 10',
  BEFORE_REMOVE_LIQUIDITY:
    'uint160 internal constant BEFORE_REMOVE_LIQUIDITY_FLAG = 1 << 9',
  AFTER_REMOVE_LIQUIDITY:
    'uint160 internal constant AFTER_REMOVE_LIQUIDITY_FLAG = 1 << 8',
  BEFORE_SWAP: 'uint160 internal constant BEFORE_SWAP_FLAG = 1 << 7',
  AFTER_SWAP: 'uint160 internal constant AFTER_SWAP_FLAG = 1 << 6',
  BEFORE_DONATE: 'uint160 internal constant BEFORE_DONATE_FLAG = 1 << 5',
  AFTER_DONATE: 'uint160 internal constant AFTER_DONATE_FLAG = 1 << 4',
  BEFORE_SWAP_RETURNS_DELTA:
    'uint160 internal constant BEFORE_SWAP_RETURNS_DELTA_FLAG = 1 << 3',
  AFTER_SWAP_RETURNS_DELTA:
    'uint160 internal constant AFTER_SWAP_RETURNS_DELTA_FLAG = 1 << 2',
  AFTER_ADD_LIQUIDITY_RETURNS_DELTA:
    'uint160 internal constant AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 1',
  AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA:
    'uint160 internal constant AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 0',
};

interface HookFlags {
  BEFORE_INITIALIZE: boolean;
  AFTER_INITIALIZE: boolean;
  BEFORE_ADD_LIQUIDITY: boolean;
  AFTER_ADD_LIQUIDITY: boolean;
  BEFORE_REMOVE_LIQUIDITY: boolean;
  AFTER_REMOVE_LIQUIDITY: boolean;
  BEFORE_SWAP: boolean;
  AFTER_SWAP: boolean;
  BEFORE_DONATE: boolean;
  AFTER_DONATE: boolean;
  BEFORE_SWAP_RETURNS_DELTA: boolean;
  AFTER_SWAP_RETURNS_DELTA: boolean;
  AFTER_ADD_LIQUIDITY_RETURNS_DELTA: boolean;
  AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA: boolean;
}

function UniswapV4HooksCheckerComponent() {
  const [hooksAddress, setHooksAddress] = useState<string>(
    '0x4444000000000000000000000000000000000EC0',
  );
  const [hooks, setHooks] = useState<HookFlags | null>(null);

  const deriveHooks = (address: string): HookFlags | null => {
    if (!ethers.isAddress(address)) {
      toast({
        ...toastOptions,
        title: 'Invalid address!',
      });
      return null;
    }

    const addressBigInt = ethers.toBigInt(address);

    const hooks: HookFlags = {
      BEFORE_INITIALIZE: Boolean(addressBigInt & BEFORE_INITIALIZE_FLAG),
      AFTER_INITIALIZE: Boolean(addressBigInt & AFTER_INITIALIZE_FLAG),
      BEFORE_ADD_LIQUIDITY: Boolean(addressBigInt & BEFORE_ADD_LIQUIDITY_FLAG),
      AFTER_ADD_LIQUIDITY: Boolean(addressBigInt & AFTER_ADD_LIQUIDITY_FLAG),
      BEFORE_REMOVE_LIQUIDITY: Boolean(
        addressBigInt & BEFORE_REMOVE_LIQUIDITY_FLAG,
      ),
      AFTER_REMOVE_LIQUIDITY: Boolean(
        addressBigInt & AFTER_REMOVE_LIQUIDITY_FLAG,
      ),
      BEFORE_SWAP: Boolean(addressBigInt & BEFORE_SWAP_FLAG),
      AFTER_SWAP: Boolean(addressBigInt & AFTER_SWAP_FLAG),
      BEFORE_DONATE: Boolean(addressBigInt & BEFORE_DONATE_FLAG),
      AFTER_DONATE: Boolean(addressBigInt & AFTER_DONATE_FLAG),
      BEFORE_SWAP_RETURNS_DELTA: Boolean(
        addressBigInt & BEFORE_SWAP_RETURNS_DELTA_FLAG,
      ),
      AFTER_SWAP_RETURNS_DELTA: Boolean(
        addressBigInt & AFTER_SWAP_RETURNS_DELTA_FLAG,
      ),
      AFTER_ADD_LIQUIDITY_RETURNS_DELTA: Boolean(
        addressBigInt & AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG,
      ),
      AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA: Boolean(
        addressBigInt & AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG,
      ),
    };

    toast({
      ...toastOptions,
      title: 'Hooks derived!',
      variant: 'default',
    });

    setHooks(hooks);
    return hooks;
  };

  return (
    <div>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Label htmlFor="token0Decimals">Hook Address</Label>
            <Input
              type="string"
              value={hooksAddress.toString()}
              onChange={(e) => setHooksAddress(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={() => deriveHooks(hooksAddress)}>
            Check Hooks
          </Button>

          {hooksAddress && (
            <AddressToBinary address={hooksAddress.toString()} />
          )}
          {hooks && (
            <div>
              <h3 className="text-lg font-semibold">Derived Hooks</h3>
              <p>
                {
                  Object.entries(hooks).filter(([hook, enabled]) => enabled)
                    .length
                }{' '}
                hooks enabled
              </p>
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Hook</th>
                    <th className="border px-4 py-2">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(hooks).map(([hook, enabled]) => (
                    <tr key={hook}>
                      <td className="border px-4 py-2 flex flex-row items-center ">
                        {hook.replace(/_/g, ' ').toLowerCase()}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircledIcon className="ml-2 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{hooksInfo[hook]!}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {enabled ? (
                          <CheckIcon color="green" />
                        ) : (
                          <Cross2Icon color="red" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UniswapV4HooksCheckerComponent;
