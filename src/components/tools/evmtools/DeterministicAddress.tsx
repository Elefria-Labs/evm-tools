import { useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Label } from '@shadcn-components/ui/label';
import { useAccount, usePublicClient } from 'wagmi';

const DeterministicAddress = () => {
  // const { provider, address } = props;

  const account = useAccount();
  const publicClient = usePublicClient();
  const [addressInput, setAddressInput] = useState<string | undefined>();
  const [nonce, setNonce] = useState<number | null>(1);
  const [contractAddress, setContractAddress] = useState('');
  const [salt, setSalt] = useState('Salt');
  const [useCreate2, setUseCreate2] = useState(false);
  const [byteCode, setByteCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (account?.address == null || (publicClient && addressInput)) {
      return;
    }
    setAddressInput(account.address);
  }, [account, publicClient, addressInput]);

  useEffect(() => {
    const getNonce = async () => {
      if (
        addressInput == null ||
        !ethers.utils.isAddress(addressInput) ||
        publicClient == null
      ) {
        return;
      }

      const nonce = await publicClient.getTransactionCount({
        address: addressInput as `0x${string}`,
      });

      setNonce(nonce == 0 ? 1 : nonce);
    };
    getNonce();
  }, [addressInput, publicClient]);

  const isValidAddress = (address?: string) => {
    if (address == null || !ethers.utils.isAddress(address)) {
      return false;
    }
    return true;
  };
  const generateContractAddress = async () => {
    if (!isValidAddress(addressInput)) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet or provide an address.',
      });
      return;
    }
    if (!addressInput || !nonce) {
      toast({ ...toastOptions, title: 'Please check input.' });
      return;
    }
    const contractAddress = ethers.utils.getContractAddress({
      from: addressInput,
      nonce: nonce,
    });
    setContractAddress(contractAddress);
  };

  const generateContractAddressWithSalt = async () => {
    if (publicClient == null || !isValidAddress(addressInput)) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet and provide a valid address!',
      });
      return;
    }
    if (!addressInput || !salt || !byteCode) {
      toast({ ...toastOptions, title: 'Please provide correct input!' });
      return;
    }
    const contractAddress = ethers.utils.getCreate2Address(
      addressInput,
      ethers.utils.keccak256(salt),
      byteCode,
    );
    setContractAddress(contractAddress);
  };
  const handleNonceChange = (e: any) => {
    setNonce(e.target.value);
  };

  return (
    <div>
      <h4 className="font-bold">
        Contract address when deployed from the below account
      </h4>
      <Input
        type="text"
        placeholder="0xAccountAddress.."
        value={addressInput}
        onChange={(e) => setAddressInput(e.target.value)}
      />
      {!useCreate2 && (
        <Input
          type="number"
          placeholder="Nonce"
          value={nonce ?? 1}
          onChange={handleNonceChange}
        />
      )}
      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
        <Checkbox
          checked={useCreate2}
          onCheckedChange={(e) => setUseCreate2(e.valueOf() as boolean)}
        />

        <div className="space-y-1 leading-none">
          <Label>Determine address using create2 (salt)</Label>
        </div>
      </div>
      {useCreate2 && (
        <>
          <Input
            type="text"
            placeholder="Salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
          <Textarea
            placeholder="Enter contract bytecode"
            rows={6}
            value={byteCode}
            onChange={(e) => setByteCode(e.target.value)}
          />
        </>
      )}

      <Button
        className="w-full"
        onClick={
          useCreate2 ? generateContractAddressWithSalt : generateContractAddress
        }
      >
        Generate
      </Button>
      <div>
        {contractAddress && <Label>Contract Address: {contractAddress}</Label>}
      </div>
    </div>
  );
};

export default DeterministicAddress;
