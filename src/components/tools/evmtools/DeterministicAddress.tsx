import { useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Label } from '@shadcn-components/ui/label';

type DeterministicAddressPropsType = {
  provider?: ethers.providers.JsonRpcProvider;
  address?: string;
};
const DeterministicAddress = (props: DeterministicAddressPropsType) => {
  const { provider, address } = props;

  const [account, setAccount] = useState(address);
  const [nonce, setNonce] = useState<number | null>(1);
  const [contractAddress, setContractAddress] = useState('');
  const [salt, setSalt] = useState('Salt');
  const [useCreate2, setUseCreate2] = useState(false);
  const [byteCode, setByteCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setAccount(address);
    const getNonce = async () => {
      if (address && provider) {
        const nonce = await provider.getTransactionCount(address);
        setNonce(nonce == 0 ? 1 : nonce);
      }
    };
    getNonce();
  }, [address, provider]);

  const generateContractAddress = async () => {
    if (provider == null) {
      toast({ ...toastOptions, title: 'Please connect wallet.' });
      return;
    }
    if (!account || !nonce) {
      toast({ ...toastOptions, title: 'Please check input.' });
      return;
    }
    const contractAddress = ethers.utils.getContractAddress({
      from: account,
      nonce: nonce,
    });
    setContractAddress(contractAddress);
  };

  const generateContractAddressWithSalt = async () => {
    if (provider == null || account == null) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet or provide an address',
      });
      return;
    }
    if (!account || !salt || !byteCode) {
      toast({ ...toastOptions, title: 'Please provide correct input!' });
      return;
    }
    const contractAddress = ethers.utils.getCreate2Address(
      account,
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
        value={account}
        onChange={(e) => setAccount(e.target.value)}
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
