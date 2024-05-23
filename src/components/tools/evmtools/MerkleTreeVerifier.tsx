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

const defaultInput =
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045\n0xeee718c1e522ecb4b609265db7a83ab48ea0b06f\n0x14536667cd30e52c0b458baaccb9fada7046e056';

const MerkleTreeVerifier = () => {
  const [addressesInput, setAddressesInput] = useState(defaultInput.toString());
  const [merkleRoot, setMerkleRoot] = useState('');
  const [verifyAddress, setVerifyAddress] = useState('');
  const [proofAddressInput, setProofAddressInput] = useState('');
  const [addressProof, setAddressProof] = useState('');
  const [, setAddressBelongs] = useState(false);
  const { toast } = useToast();

  const handleAddressesInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAddressesInput(event.target.value);
  };

  const handleVerifyAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerifyAddress(event.target.value);
  };

  const handleProofAddressInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProofAddressInput(event.target.value);
  };

  const getTree = (addressesInput: string) => {
    try {
      const addresses = addressesInput
        .split('\n')
        .map((address) => address.trim());
      const areAllEvmAddr = addresses.every((addr) =>
        ethers.utils.isAddress(addr),
      );
      const noDuplicates = new Set(addresses).size !== addresses.length;
      if (!areAllEvmAddr || noDuplicates) {
        toast({
          ...toastOptions,
          title: 'Invalid or duplicate addresses.',
        });
        return;
      }

      return StandardMerkleTree.of(
        addresses.map((a) => [a]),
        ['address'],
      );
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Unable to parse merkle leaves. Please check your input.',
      });
    }
  };

  const handleCreateMerkleRoot = () => {
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }
    const root = tree.root;
    setMerkleRoot(root);
  };

  const handleVerifyAddress = () => {
    if (
      !verifyAddress ||
      !merkleRoot ||
      !ethers.utils.isAddress(verifyAddress)
    ) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }

    const proof = tree.getProof([verifyAddress]);

    // Verify if the address belongs to the Merkle root
    const isValid = tree.verify([verifyAddress], proof);
    setAddressBelongs(isValid);
    if (isValid) {
      toast({
        ...toastOptions,
        title: 'Address is present in the merkle tree.',
        variant: 'default',
      });
    }
  };

  const handleGenerateProof = () => {
    if (!proofAddressInput || !ethers.utils.isAddress(proofAddressInput)) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }
    try {
      const proof = tree.getProof([proofAddressInput]);
      setAddressProof(JSON.stringify(proof));
      toast({
        ...toastOptions,
        title: 'Proof generated successfully!',
        variant: 'default',
      });
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Failed to generate valid proof.',
      });
    }
  };

  return (
    <div>
      <Label className="mb-4">Enter addresses (one per line):</Label>
      <Textarea
        placeholder="Enter addresses, one per line"
        rows={6}
        // size={['xs', 'xs', 'md']}
        className="sm:text-sm text-md"
        value={addressesInput}
        onChange={handleAddressesInputChange}
      />
      <Button className="w-full" onClick={handleCreateMerkleRoot}>
        Create Merkle Root
      </Button>
      {merkleRoot && (
        <div className="mt-4">
          <h4>Merkle Root: {merkleRoot}</h4>
        </div>
      )}
      <Separator className="my-2" />
      <Label>Generate merkle proof</Label>
      <Input
        placeholder="Address"
        value={proofAddressInput}
        onChange={handleProofAddressInput}
      />
      <Button className="w-full" onClick={handleGenerateProof}>
        Generate Proof
      </Button>
      {addressProof && <Textarea rows={6} value={addressProof} disabled />}
      <Separator className="my-2" />
      <Label>Verify if an address belongs to the Merkle tree:</Label>
      <Input
        placeholder="Address to Verify"
        value={verifyAddress}
        onChange={handleVerifyAddressChange}
      />
      <Button className="w-full" onClick={handleVerifyAddress}>
        Verify Address
      </Button>
    </div>
  );
};

export default MerkleTreeVerifier;
