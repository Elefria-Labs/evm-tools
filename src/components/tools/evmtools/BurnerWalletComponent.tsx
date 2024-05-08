import React, { useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Label } from '@shadcn-components/ui/label';
import { ethers } from 'ethers';

export default function BurnerWalletComponent() {
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [publicAddress, setPublicAddress] = useState('');
  const [useEntropy, setUseEntropy] = useState(false);
  const [entropy, setEntropy] = useState('');
  const [entropyLoader, setEntropyLoader] = useState(0);
  const { toast } = useToast();
  const generateKeys = (entropy?: string) => {
    const wallet = ethers.Wallet.createRandom(entropy);
    setPrivateKey(wallet.privateKey);
    setPublicKey(wallet.publicKey);
    setPublicAddress(wallet.address);
  };

  useEffect(() => {
    if (entropyLoader == 100 && useEntropy) {
      generateKeys(entropy);
      toast({
        title: 'New private key generated',
        variant: 'default',
      });
      setUseEntropy(false);
      setEntropyLoader(0);
      return;
    }
    const mouseMoveHandler = (event: any) => {
      setEntropyLoader(entropyLoader + 1);
      setEntropy(`${entropy}${event.clientX}${event.clientY}`);
    };
    if (useEntropy) {
      window.addEventListener('mousemove', mouseMoveHandler);
    }

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [useEntropy, entropy, entropyLoader, toast]);

  return (
    <div>
      <div>
        <h3 className="mb-4 font-bold ">Generate Random Private Key Pair</h3>

        <Button onClick={() => generateKeys()} disabled={useEntropy}>
          Generate Keys
        </Button>
        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <Checkbox
            checked={useEntropy}
            onCheckedChange={(e) => setUseEntropy(e.valueOf() as boolean)}
          />

          <div className="space-y-1 leading-none">
            <Label>
              Use entropy from cursor movement. Move the cursor on the screen to
              generate randomness.
            </Label>
          </div>
        </div>

        {useEntropy && (
          <Progress hasStripe value={entropyLoader} border={'4px'} />
        )}
      </div>
      <div className="mt-4">
        <Label>Private Key</Label>
        <Input value={privateKey} disabled />
      </div>
      <div className="mt-4">
        <Label>Public Key</Label>
        <Input value={publicKey} disabled />
      </div>
      <div className="mt-4">
        <Label>Public Address</Label>
        <Input value={publicAddress} disabled />
      </div>
    </div>
  );
}
