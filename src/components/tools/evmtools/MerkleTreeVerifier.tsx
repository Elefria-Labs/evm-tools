import { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { Label } from '@shadcn-components/ui/label';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Separator } from '@shadcn-components/ui/separator';

const MerkleTreeVerifier = () => {
  const [structureInput, setStructureInput] = useState(
    'address,uint256,string,bytes,bytes32,bool',
  );
  const [elementsInput, setElementsInput] = useState(
    '0xd8da6bf26964af9d7eed9e03e53415d37aa96045,100,hello,0x1234,0x1234567890123456789012345678901234567890123456789012345678901234,true\n0xeee718c1e522ecb4b609265db7a83ab48ea0b06f,200,world,0x5678,0x2345678901234567890123456789012345678901234567890123456789012345,false',
  );
  const [merkleRoot, setMerkleRoot] = useState('');
  const [verifyElement, setVerifyElement] = useState('');
  const [proofElementInput, setProofElementInput] = useState('');
  const [elementProof, setElementProof] = useState('');
  const [, setElementBelongs] = useState(false);
  const { toast } = useToast();

  const handleStructureInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStructureInput(event.target.value);
  };

  const handleElementsInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setElementsInput(event.target.value);
  };

  const handleVerifyElementChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerifyElement(event.target.value);
  };

  const handleProofElementInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProofElementInput(event.target.value);
  };

  const parseElements = (elementsInput: string, structure: string[]): any[] => {
    const elements = elementsInput.split('\n').map((line) => line.split(','));
    return elements.map((element) => {
      if (element.length !== structure.length) {
        throw new Error(`Invalid element: ${element.join(',')}`);
      }
      return element.map((value, index) => {
        switch (structure[index]) {
          case 'address':
            if (!ethers.utils.isAddress(value)) {
              throw new Error(`Invalid address: ${value}`);
            }
            return value;
          case 'uint256':
            if (!/^\d+$/.test(value)) {
              throw new Error(`Invalid uint256: ${value}`);
            }
            return value;
          case 'string':
            return value;
          case 'bytes':
            if (!/^0x[0-9a-fA-F]*$/.test(value)) {
              throw new Error(`Invalid bytes: ${value}`);
            }
            return value;
          case 'bytes32':
            if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
              throw new Error(`Invalid bytes32: ${value}`);
            }
            return value;
          case 'bool':
            if (value !== 'true' && value !== 'false') {
              throw new Error(`Invalid bool: ${value}`);
            }
            return value === 'true';
          default:
            throw new Error(`Unsupported type: ${structure[index]}`);
        }
      });
    });
  };

  const getTree = () => {
    try {
      const structure = structureInput.split(',').map((s) => s.trim());
      const elements = parseElements(elementsInput, structure);

      const noDuplicates =
        // @ts-ignore
        new Set(elements.map(JSON.stringify)).size === elements.length;
      if (!noDuplicates) {
        throw new Error('Duplicate elements found');
      }

      return StandardMerkleTree.of(elements, structure);
    } catch (e) {
      toast({
        ...toastOptions,
        title: `Error: ${(e as Error).message}`,
      });
    }
  };

  const handleCreateMerkleRoot = () => {
    const tree = getTree();
    if (tree == null) {
      return;
    }
    const root = tree.root;
    setMerkleRoot(root);
    toast({
      ...toastOptions,
      title: 'Merkle root created successfully!',
      variant: 'default',
    });
  };

  const handleVerifyElement = () => {
    if (!verifyElement || !merkleRoot) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree();
    if (tree == null) {
      return;
    }

    try {
      const structure = structureInput.split(',').map((s) => s.trim());
      const elementArray = parseElements(verifyElement, structure)[0];
      const proof = tree.getProof(elementArray);

      // Verify if the element belongs to the Merkle root
      const isValid = tree.verify(elementArray, proof);
      setElementBelongs(isValid);
      toast({
        ...toastOptions,
        title: isValid
          ? 'Element is present in the merkle tree.'
          : 'Element is not present in the merkle tree.',
        variant: isValid ? 'default' : 'destructive',
      });
    } catch (e) {
      toast({
        ...toastOptions,
        title: `Error: ${(e as Error).message}`,
      });
    }
  };

  const handleGenerateProof = () => {
    if (!proofElementInput) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree();
    if (tree == null) {
      return;
    }
    try {
      const structure = structureInput.split(',').map((s) => s.trim());
      const elementArray = parseElements(proofElementInput, structure)[0];
      const proof = tree.getProof(elementArray);
      setElementProof(JSON.stringify(proof));
      toast({
        ...toastOptions,
        title: 'Proof generated successfully!',
        variant: 'default',
      });
    } catch (e) {
      toast({
        ...toastOptions,
        title: `Error: ${(e as Error).message}`,
      });
    }
  };

  return (
    <div>
      <Label className="mb-4">Enter element structure (comma-separated):</Label>
      <Input
        placeholder="e.g., address,uint256,string,bytes,bytes32,bool"
        value={structureInput}
        onChange={handleStructureInputChange}
      />
      <Label className="mb-4 mt-4">
        Enter elements (one per line, comma-separated):
      </Label>
      <Textarea
        placeholder="Enter elements, one per line, comma-separated"
        rows={6}
        className="sm:text-sm text-md"
        value={elementsInput}
        onChange={handleElementsInputChange}
      />
      <Button className="w-full mt-2" onClick={handleCreateMerkleRoot}>
        Create Merkle Root
      </Button>
      {merkleRoot && (
        <div className="mt-4">
          <h4 className="break-words">Merkle Root: {merkleRoot}</h4>
        </div>
      )}
      <Separator className="my-2" />
      <Label>Generate merkle proof</Label>
      <Input
        placeholder="Element (comma-separated)"
        value={proofElementInput}
        onChange={handleProofElementInput}
      />
      <Button className="w-full mt-2" onClick={handleGenerateProof}>
        Generate Proof
      </Button>
      {elementProof && <Textarea rows={6} value={elementProof} disabled />}
      <Separator className="my-2" />
      <Label>Verify if an element belongs to the Merkle tree:</Label>
      <Input
        placeholder="Element to Verify (comma-separated)"
        value={verifyElement}
        onChange={handleVerifyElementChange}
      />
      <Button className="w-full mt-2" onClick={handleVerifyElement}>
        Verify Element
      </Button>
    </div>
  );
};

export default MerkleTreeVerifier;
