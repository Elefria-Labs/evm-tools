import { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';

function HexConverterComponent() {
  const [decimals, setDecimals] = useState<BigInt>(BigInt(0));
  const [hexadecimals, setHexadecimals] = useState('');
  const [binary, setBinary] = useState('');
  const { toast } = useToast();
  const convertDecToHex = (dec: BigInt) => {
    try {
      const hex = dec.toString(16);
      setHexadecimals(`0x${hex}`);
      setBinary(dec.toString(2));
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  const convertHexToDecimal = (hexValue: string) => {
    if (!ethers.isHexString(hexValue)) {
      return;
    }
    try {
      const dec = ethers.toBigInt(hexValue);
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
            value={decimals.toString()}
            onChange={(e) => {
              setDecimals(BigInt(e.target.value));
              convertDecToHex(BigInt(e.target.value));
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
              setDecimals(BigInt('0b' + e.target.value));
              setHexadecimals(
                `0x${BigInt('0b' + e.target.value).toString(16)}`,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HexConverterComponent;
