import { useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import { Button } from '@shadcn-components/ui/button';
import {
  TabsList,
  TabsTrigger,
  TabsContent,
  Tabs,
} from '@shadcn-components/ui/tabs';
import { toast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import { ethers } from 'ethers';

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
  NO_OP: boolean;
  ACCESS_LOCK: boolean;
}

function UniswapV4HooksCheckerComponent() {
  const [hooksAddress, setHooksAddress] = useState<string>(
    '0x4444000000000000000000000000000000000aC2',
  );
  const [binaryAddress, setBinaryAddress] = useState<string>(
    '0x4444000000000000000000000000000000000aC2',
  );

  const deriveHooks = (address: string): HookFlags | null => {
    if (!ethers.utils.isAddress(address)) {
      toast({
        ...toastOptions,
        title: 'Invalid address!',
      });
      return null;
    }

    const addressBigInt = ethers.BigNumber.from(address).toBigInt();
    setBinaryAddress(addressBigInt.toString(2));

    const hooks: HookFlags = {
      BEFORE_INITIALIZE: Boolean(addressBigInt & (1n << 159n)),
      AFTER_INITIALIZE: Boolean(addressBigInt & (1n << 158n)),
      BEFORE_ADD_LIQUIDITY: Boolean(addressBigInt & (1n << 157n)),
      AFTER_ADD_LIQUIDITY: Boolean(addressBigInt & (1n << 156n)),
      BEFORE_REMOVE_LIQUIDITY: Boolean(addressBigInt & (1n << 155n)),
      AFTER_REMOVE_LIQUIDITY: Boolean(addressBigInt & (1n << 154n)),
      BEFORE_SWAP: Boolean(addressBigInt & (1n << 153n)),
      AFTER_SWAP: Boolean(addressBigInt & (1n << 152n)),
      BEFORE_DONATE: Boolean(addressBigInt & (1n << 151n)),
      AFTER_DONATE: Boolean(addressBigInt & (1n << 150n)),
      NO_OP: Boolean(addressBigInt & (1n << 149n)),
      ACCESS_LOCK: Boolean(addressBigInt & (1n << 148n)),
    };

    toast({
      ...toastOptions,
      title: 'Hooks derived!',
      variant: 'default',
    });

    console.log('hooks -m', hooks);
    return hooks;
  };

  return (
    <div>
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <Tabs defaultValue="sqrtPrice">
          <TabsList>
            <TabsTrigger value={'hookChecker'}>Hooks Checker</TabsTrigger>
          </TabsList>
          {/* //height: `472px`, // -${56}px -${70}px */}
          <div>
            <TabsContent value={'hookChecker'}>
              <>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <Label htmlFor="token0Decimals">Hook Address</Label>
                    <Input
                      type="string"
                      value={hooksAddress.toString()}
                      onChange={(e) => setHooksAddress(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => deriveHooks(hooksAddress)}
                  >
                    Check Hooks
                  </Button>

                  <div style={{ marginBottom: '10px' }}>
                    <Label>Binary Address</Label>
                    <Input
                      type="string"
                      value={binaryAddress.toString()}
                      disabled
                    />
                  </div>
                </div>
              </>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default UniswapV4HooksCheckerComponent;
