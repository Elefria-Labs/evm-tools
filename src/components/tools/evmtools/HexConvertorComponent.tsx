import { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';

function HexConvertorComponent() {
  const [decimals, setDecimals] = useState<number>(0);
  const [hexadecimals, setHexadecimals] = useState('');
  const [binary, setBinary] = useState('');
  const { toast } = useToast();
  const convertDecToHex = (dec: number) => {
    try {
      const hex = dec.toString(16);
      setHexadecimals(`0x${hex}`);
      setBinary(Number(dec).toString(2));
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  const convertHexToDecimal = (hexValue: string) => {
    if (!ethers.utils.isHexString(hexValue)) {
      return;
    }
    try {
      const dec = parseInt(hexValue, 16);
      setDecimals(dec);
      setBinary(dec.toString(2));
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  return (
    <div>
      <div>
        <div>
          <Label>Decimal</Label>
          <Input
            type="number"
            value={decimals}
            onChange={(e) => {
              setDecimals(Number(e.target.value));
              convertDecToHex(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <Label>Hex</Label>
          <Input
            type="text"
            value={hexadecimals}
            onChange={(e) => {
              setHexadecimals(e.target.value);

              convertHexToDecimal(e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Binary</Label>
          <Input
            type="text"
            value={binary}
            onChange={(e) => {
              setBinary(e.target.value);

              // Regular expression pattern to match
              // only 0s and 1s
              const binaryPattern = /^[01]+$/;

              // Test if the string matches the pattern
              if (!binaryPattern.test(e.target.value)) {
                return;
              }
              setDecimals(parseInt(e.target.value, 2));
              setHexadecimals(`0x${parseInt(e.target.value, 2).toString(16)}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HexConvertorComponent;
