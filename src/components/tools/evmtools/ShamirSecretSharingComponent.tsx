import React, { useState } from 'react';
// @ts-ignore
import shamir from 'shamirs-secret-sharing';

import { Button } from '@shadcn-components/ui/button';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@radix-ui/react-label';
import { toast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import { Textarea } from '@shadcn-components/ui/textarea';

const ShamirSecretSharingComponent: React.FC = () => {
  const [secret, setSecret] = useState<string>('let me tell you a secret');
  const [threshold, setThreshold] = useState<number>(2);
  const [numOfShares, setNumOfShares] = useState<number>(5);
  const [shares, setShares] = useState<{ value: string; selected: boolean }[]>(
    [],
  );
  const [reconstructedSecret, setReconstructedSecret] = useState<string>('');

  const generateShares = () => {
    const generatedShares = shamir.split(secret, {
      shares: numOfShares,
      threshold,
    });
    const updatedShares = generatedShares.map((share: any) => ({
      value: share.toString('hex'),
      selected: false,
    }));

    setShares(updatedShares);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedShares = [...shares];
    updatedShares[index]!.selected = !updatedShares[index]!.selected;
    setShares(updatedShares);
  };

  const reconstructSecret = () => {
    if (shares.length == 0) {
      return;
    }
    const selectedShares = shares
      .filter((share) => share.selected)
      .map((share) => share.value);
    if (selectedShares.length >= threshold) {
      const reconstructed = shamir.combine(selectedShares.slice(0, threshold));
      setReconstructedSecret(reconstructed.toString());
    } else {
      toast({
        ...toastOptions,
        title: `Select at least ${threshold} shares to reconstruct the secret.`,
      });
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[480px] w-[100%]">
        {/* <h2 className="text-lg font-bold mb-4">
          Shamirs Secret Sharing Demo
          <span className="text-sm ml-2">How it works?</span>
        </h2> */}

        <Label>Enter a secret (Private Key)</Label>
        <Input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <Label>Number of Shares:</Label>
        <Input
          type="number"
          value={numOfShares}
          onChange={(e) => setNumOfShares(parseInt(e.target.value))}
        />
        <Label>Threshold:</Label>
        <Input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
        />
        <Button className="w-full" onClick={generateShares}>
          Generate Shares
        </Button>

        {shares.length > 0 && (
          <div>
            <h3 className="text-lg font-bold my-4">Generated Shares:</h3>
            <p className="text-sm my-4">
              Total {shares.length} shares generated.
            </p>
            <ul>
              {shares.map((share, index) => (
                <li key={index} className="mb-2 flex flex-row items-center">
                  <Checkbox
                    checked={share.selected}
                    onCheckedChange={(_) => {
                      setReconstructedSecret('');
                      handleCheckboxChange(index);
                    }}
                  />
                  <Textarea
                    className="ml-4"
                    rows={3}
                    value={share.value.toString()}
                    disabled
                  />
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={reconstructSecret}>
              Reconstruct Secret
            </Button>
            {reconstructedSecret && (
              <div>
                <h3 className="text-lg font-bold my-4">
                  Reconstructed Secret:
                </h3>
                <Input disabled value={reconstructedSecret} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShamirSecretSharingComponent;
