import { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';

function StringByteConversion() {
  const [stringInput, setStringInput] = useState('');
  const [bytesInput, setBytesInput] = useState('');
  const { toast } = useToast();
  const convertToBytes = (stringValue: string) => {
    try {
      const bytesValue = ethers.utils.formatBytes32String(stringValue);
      setBytesInput(bytesValue);
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  const convertToString = (bytesValue: string) => {
    try {
      const stringValue = ethers.utils.parseBytes32String(bytesValue);
      setStringInput(stringValue);
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
          <Label>String Input</Label>
          <Input
            type="text"
            value={stringInput}
            onChange={(e) => {
              setStringInput(e.target.value);
              convertToBytes(e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Bytes32 Input</Label>
          <Input
            type="text"
            value={bytesInput}
            onChange={(e) => {
              setBytesInput(e.target.value);
              convertToString(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StringByteConversion;
