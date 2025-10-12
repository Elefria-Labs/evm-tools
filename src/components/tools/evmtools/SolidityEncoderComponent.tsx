import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription } from '@shadcn-components/ui/alert';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import { Textarea } from '@shadcn-components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import { CopyIcon } from '@radix-ui/react-icons';

interface EncodingResult {
  result: string;
  error: string;
}

const SolidityEncoderComponent: React.FC = () => {
  // abi.encode state
  const [abiEncodeTypes, setAbiEncodeTypes] = useState<string>(
    'uint256,string,bool',
  );
  const [abiEncodeValues, setAbiEncodeValues] =
    useState<string>('123,"hello",true');
  const [abiEncodeResult, setAbiEncodeResult] = useState<EncodingResult>({
    result: '',
    error: '',
  });

  // abi.encodePacked state
  const [abiEncodePackedTypes, setAbiEncodePackedTypes] = useState<string>(
    'uint256,string,bool',
  );
  const [abiEncodePackedValues, setAbiEncodePackedValues] =
    useState<string>('123,"hello",true');
  const [abiEncodePackedResult, setAbiEncodePackedResult] =
    useState<EncodingResult>({ result: '', error: '' });

  // abi.encodeWithSelector state
  const [selectorFunction, setSelectorFunction] = useState<string>(
    'transfer(address,uint256)',
  );
  const [selectorTypes, setSelectorTypes] = useState<string>('address,uint256');
  const [selectorValues, setSelectorValues] = useState<string>(
    '0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000',
  );
  const [selectorResult, setSelectorResult] = useState<EncodingResult>({
    result: '',
    error: '',
  });

  // abi.encodeWithSignature state
  const [signatureFunction, setSignatureFunction] = useState<string>(
    'transfer(address,uint256)',
  );
  const [signatureTypes, setSignatureTypes] =
    useState<string>('address,uint256');
  const [signatureValues, setSignatureValues] = useState<string>(
    '0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000',
  );
  const [signatureResult, setSignatureResult] = useState<EncodingResult>({
    result: '',
    error: '',
  });

  // abi.encodeCall state
  const [callFunctionAbi, setCallFunctionAbi] = useState<string>(
    '{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]}',
  );
  const [callValues, setCallValues] = useState<string>(
    '0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000',
  );
  const [callResult, setCallResult] = useState<EncodingResult>({
    result: '',
    error: '',
  });

  const parseValues = (valuesStr: string): any[] => {
    try {
      // Handle comma-separated values with proper parsing
      const values = valuesStr.split(',').map((val) => {
        const trimmed = val.trim();

        // Handle strings (quoted)
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return trimmed.slice(1, -1);
        }

        // Handle booleans
        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;

        // Handle numbers
        if (!isNaN(Number(trimmed))) {
          return trimmed;
        }

        // Return as-is (addresses, etc.)
        return trimmed;
      });

      return values;
    } catch (error) {
      throw new Error('Invalid values format');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAbiEncode = () => {
    try {
      const types = abiEncodeTypes.split(',').map((t) => t.trim());
      const values = parseValues(abiEncodeValues);

      if (types.length !== values.length) {
        throw new Error('Number of types and values must match');
      }

      const encoded = ethers.AbiCoder.defaultAbiCoder().encode(types, values);
      setAbiEncodeResult({ result: encoded, error: '' });
    } catch (error) {
      setAbiEncodeResult({ result: '', error: (error as Error).message });
    }
  };

  const handleAbiEncodePacked = () => {
    try {
      const types = abiEncodePackedTypes.split(',').map((t) => t.trim());
      const values = parseValues(abiEncodePackedValues);

      if (types.length !== values.length) {
        throw new Error('Number of types and values must match');
      }

      const encoded = ethers.solidityPacked(types, values);
      setAbiEncodePackedResult({ result: encoded, error: '' });
    } catch (error) {
      setAbiEncodePackedResult({ result: '', error: (error as Error).message });
    }
  };

  const handleEncodeWithSelector = () => {
    try {
      const types = selectorTypes.split(',').map((t) => t.trim());
      const values = parseValues(selectorValues);

      if (types.length !== values.length) {
        throw new Error('Number of types and values must match');
      }

      const selector = ethers.id(selectorFunction).slice(0, 10);
      const encoded = ethers.AbiCoder.defaultAbiCoder().encode(types, values);
      const result = selector + encoded.slice(2);

      setSelectorResult({ result: result, error: '' });
    } catch (error) {
      setSelectorResult({ result: '', error: (error as Error).message });
    }
  };

  const handleEncodeWithSignature = () => {
    try {
      const types = signatureTypes.split(',').map((t) => t.trim());
      const values = parseValues(signatureValues);

      if (types.length !== values.length) {
        throw new Error('Number of types and values must match');
      }

      const iface = new ethers.Interface([`function ${signatureFunction}`]);
      const functionName = signatureFunction.split('(')[0];
      const encoded = iface.encodeFunctionData(functionName, values);

      setSignatureResult({ result: encoded, error: '' });
    } catch (error) {
      setSignatureResult({ result: '', error: (error as Error).message });
    }
  };

  const handleEncodeCall = () => {
    try {
      const abi = JSON.parse(callFunctionAbi);
      const values = parseValues(callValues);

      if (!abi.inputs || abi.inputs.length !== values.length) {
        throw new Error('Number of values must match function inputs');
      }

      const iface = new ethers.Interface([abi]);
      const encoded = iface.encodeFunctionData(abi.name, values);

      setCallResult({ result: encoded, error: '' });
    } catch (error) {
      setCallResult({ result: '', error: (error as Error).message });
    }
  };

  const EncodingSection = ({
    title,
    description,
    useCase,
    children,
  }: {
    title: string;
    description: string;
    useCase: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
        <h3 className="font-semibold text-lg text-black">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-blue-600 mt-1">
          <strong>Use case:</strong> {useCase}
        </p>
      </div>
      {children}
    </div>
  );

  const ResultDisplay = ({ result, error }: EncodingResult) => (
    <>
      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Encoded Result</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result)}
              className="h-8 px-2"
            >
              <CopyIcon className="h-3 w-3" />
            </Button>
          </div>
          <Textarea
            value={result}
            readOnly
            className="font-mono text-xs"
            rows={4}
          />
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Solidity Encoder</h1>
      </div> */}

      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="encode">abi.encode</TabsTrigger>
          <TabsTrigger value="encodePacked">encodePacked</TabsTrigger>
          <TabsTrigger value="encodeWithSelector">
            encodeWithSelector
          </TabsTrigger>
          <TabsTrigger value="encodeWithSignature">
            encodeWithSignature
          </TabsTrigger>
          <TabsTrigger value="encodeCall">encodeCall</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-6">
          <EncodingSection
            title="abi.encode"
            description="Standard ABI encoding with padding for each parameter"
            useCase="Cross-contract calls and off-chain data processing"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="encode-types">Types (comma-separated)</Label>
                <Input
                  id="encode-types"
                  value={abiEncodeTypes}
                  onChange={(e) => setAbiEncodeTypes(e.target.value)}
                  placeholder="uint256,string,bool"
                />
              </div>
              <div>
                <Label htmlFor="encode-values">Values (comma-separated)</Label>
                <Input
                  id="encode-values"
                  value={abiEncodeValues}
                  onChange={(e) => setAbiEncodeValues(e.target.value)}
                  placeholder='123,"hello",true'
                />
              </div>
            </div>
            <Button onClick={handleAbiEncode} className="w-full">
              Encode with abi.encode
            </Button>
            <ResultDisplay {...abiEncodeResult} />
          </EncodingSection>
        </TabsContent>

        <TabsContent value="encodePacked" className="mt-6">
          <EncodingSection
            title="abi.encodePacked"
            description="Packed encoding without padding, concatenates values tightly"
            useCase="Hashing operations and digital signatures"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packed-types">Types (comma-separated)</Label>
                <Input
                  id="packed-types"
                  value={abiEncodePackedTypes}
                  onChange={(e) => setAbiEncodePackedTypes(e.target.value)}
                  placeholder="uint256,string,bool"
                />
              </div>
              <div>
                <Label htmlFor="packed-values">Values (comma-separated)</Label>
                <Input
                  id="packed-values"
                  value={abiEncodePackedValues}
                  onChange={(e) => setAbiEncodePackedValues(e.target.value)}
                  placeholder='123,"hello",true'
                />
              </div>
            </div>
            <Button onClick={handleAbiEncodePacked} className="w-full">
              Encode with abi.encodePacked
            </Button>
            <ResultDisplay {...abiEncodePackedResult} />
          </EncodingSection>
        </TabsContent>

        <TabsContent value="encodeWithSelector" className="mt-6">
          <EncodingSection
            title="abi.encodeWithSelector"
            description="Encodes function call data with 4-byte function selector prefix"
            useCase="Low-level contract calls and proxy implementations"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="selector-function">Function Signature</Label>
                <Input
                  id="selector-function"
                  value={selectorFunction}
                  onChange={(e) => setSelectorFunction(e.target.value)}
                  placeholder="transfer(address,uint256)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="selector-types">Parameter Types</Label>
                  <Input
                    id="selector-types"
                    value={selectorTypes}
                    onChange={(e) => setSelectorTypes(e.target.value)}
                    placeholder="address,uint256"
                  />
                </div>
                <div>
                  <Label htmlFor="selector-values">Parameter Values</Label>
                  <Input
                    id="selector-values"
                    value={selectorValues}
                    onChange={(e) => setSelectorValues(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleEncodeWithSelector} className="w-full">
              Encode with abi.encodeWithSelector
            </Button>
            <ResultDisplay {...selectorResult} />
          </EncodingSection>
        </TabsContent>

        <TabsContent value="encodeWithSignature" className="mt-6">
          <EncodingSection
            title="abi.encodeWithSignature"
            description="Encodes function call using string signature (computes selector automatically)"
            useCase="Dynamic function calls when you have the signature as a string"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="signature-function">Function Signature</Label>
                <Input
                  id="signature-function"
                  value={signatureFunction}
                  onChange={(e) => setSignatureFunction(e.target.value)}
                  placeholder="transfer(address,uint256)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signature-types">Parameter Types</Label>
                  <Input
                    id="signature-types"
                    value={signatureTypes}
                    onChange={(e) => setSignatureTypes(e.target.value)}
                    placeholder="address,uint256"
                  />
                </div>
                <div>
                  <Label htmlFor="signature-values">Parameter Values</Label>
                  <Input
                    id="signature-values"
                    value={signatureValues}
                    onChange={(e) => setSignatureValues(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleEncodeWithSignature} className="w-full">
              Encode with abi.encodeWithSignature
            </Button>
            <ResultDisplay {...signatureResult} />
          </EncodingSection>
        </TabsContent>

        <TabsContent value="encodeCall" className="mt-6">
          <EncodingSection
            title="abi.encodeCall"
            description="Type-safe encoding using function ABI definition"
            useCase="type safety & create payload for function call"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="call-abi">Function ABI (JSON)</Label>
                <Textarea
                  id="call-abi"
                  value={callFunctionAbi}
                  onChange={(e) => setCallFunctionAbi(e.target.value)}
                  placeholder='{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]}'
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="call-values">Parameter Values</Label>
                <Input
                  id="call-values"
                  value={callValues}
                  onChange={(e) => setCallValues(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b8D17f0c2f2DC28c27,1000"
                />
              </div>
            </div>
            <Button onClick={handleEncodeCall} className="w-full">
              Encode with abi.encodeCall
            </Button>
            <ResultDisplay {...callResult} />
          </EncodingSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SolidityEncoderComponent;
