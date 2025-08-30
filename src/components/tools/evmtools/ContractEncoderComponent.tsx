import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription } from '@shadcn-components/ui/alert';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn-components/ui/select';
import { Textarea } from '@shadcn-components/ui/textarea';
import { useGlobalStore } from '@store/global-store';

const ContractAbiEncoder: React.FC = () => {
  // const [abi, setAbi] = useState<AbiItem[]>([]);
  const abi = useGlobalStore().contractEncoderAbi.contractAbi;
  const setAbi = useGlobalStore().setContractEncoderAbi;
  const [abiText, setAbiText] = useState<string>('');
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [encodedOutput, setEncodedOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Sync local abiText with global ABI state
  useEffect(() => {
    if (abi && abi.length > 0) {
      setAbiText(JSON.stringify(abi, null, 2));
    } else {
      setAbiText('');
    }
  }, [abi]);

  const handleAbiInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAbiText(value);
    
    try {
      const parsedAbi = JSON.parse(value);
      setAbi({ contractAbi: parsedAbi });
      setError('');
    } catch (err) {
      if (value.trim()) {
        setError('Invalid ABI format');
      } else {
        setError('');
      }
    }
  };

  const handleFunctionSelect = (value: string) => {
    setSelectedFunction(value);
    setInputs({});
    setEncodedOutput('');
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const encodeParameters = () => {
    const selectedAbi = abi?.find(
      (item) =>
        (item.type === 'constructor' && selectedFunction === 'constructor') ||
        (item.type === 'function' && item.name === selectedFunction),
    );

    if (!selectedAbi || !selectedAbi.inputs) {
      setError('Invalid function selected');
      return;
    }

    try {
      const values = selectedAbi.inputs.map((input) => inputs[input.name]);
      const iface = new ethers.Interface([selectedAbi]);
      if (selectedAbi.type === 'constructor') {
        const encoded = iface.encodeDeploy(values);
        setEncodedOutput(encoded || '');
      } else {
        const iface = new ethers.Interface([selectedAbi]);
        const encoded = iface.encodeFunctionData(selectedFunction, values);
        setEncodedOutput(encoded);
      }

      setError('');
    } catch (err) {
      setError('Error encoding parameters: ' + (err as Error).message);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="flex flex-row justify-between">
          <Label>Contract ABI</Label>
          <p
            className="text-xs hover:underline-offset-4 underline cursor-pointer decoration-sky-500 italic"
            onClick={() => {
              setAbi({ contractAbi: [] });
              setAbiText('');
            }}
          >
            {'Clear'}
          </p>
        </div>

        <Textarea
          className="w-full h-32 p-2 border rounded"
          placeholder="Paste contract ABI here..."
          value={abiText}
          onChange={handleAbiInput}
        />
      </div>

      {abi?.length > 0 && (
        <div>
          <Label>Select Function</Label>
          <Select onValueChange={handleFunctionSelect}>
            <SelectTrigger className="mt-4" id="function-select">
              <SelectValue placeholder="Select a function" />
            </SelectTrigger>
            <SelectContent>
              {abi
                .filter(
                  (item) =>
                    (item.type === 'constructor' || item.type === 'function') &&
                    item.inputs != null && // wtf?
                    item.inputs.length > 0,
                )
                .map((item, index) => (
                  <SelectItem
                    key={index}
                    value={
                      item.type === 'constructor'
                        ? 'constructor'
                        : item.name || ''
                    }
                  >
                    {item.type === 'constructor' ? 'constructor' : item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {abi.length > 0 && selectedFunction && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Function Parameters</h3>
          {abi
            .find(
              (item) =>
                (item.type === 'constructor' &&
                  selectedFunction === 'constructor') ||
                (item.type === 'function' && item.name === selectedFunction),
            )
            ?.inputs?.map((input, index) => (
              <div key={index}>
                <Label htmlFor={`input-${input.name}`}>
                  {input.name} ({input.type})
                </Label>
                <Input
                  id={`input-${input.name}`}
                  placeholder={`Enter ${input.type}`}
                  onChange={(e) =>
                    handleInputChange(input.name, e.target.value)
                  }
                />
              </div>
            ))}
          <Button className="w-full" onClick={encodeParameters}>
            Encode
          </Button>
        </div>
      )}

      {abi.length > 0 && encodedOutput && (
        <div>
          <h3 className="text-lg font-semibold">Encoded Output</h3>
          <Textarea disabled rows={8}>
            {encodedOutput}
          </Textarea>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ContractAbiEncoder;
