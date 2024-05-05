import React, { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { ethers } from 'ethers';
import { splitSignature, verifyTypedData } from 'ethers/lib/utils';
import JSONInput from 'react-json-editor-ajrm';
import { SignatureLike } from '@ethersproject/bytes';
import {
  GenericData712Type,
  getEip721DataByTemplate,
} from '@components/eip712/eip712type';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@shadcn-components/ui/select';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
const locale = require('react-json-editor-ajrm/locale/en');

type Eip712PlaygroundType = {
  provider?: ethers.providers.Web3Provider;
  address?: string;
};

export function Eip712PlaygroundComponent(props: Eip712PlaygroundType) {
  const { provider, address } = props;
  const toast = useToast();
  // @ts-ignore
  const [signTypedData, setSignTypedData] = useState<string | undefined>();
  const [sig, setSig] = useState<string | undefined>();
  const [eip721Template, setEip712Template] = useState<string>('');
  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [data7122, setData7122] = useState<
    GenericData712Type<Record<string, string | number>, Record<string, string>>
  >(getEip721DataByTemplate('default'));
  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (eip721Template == null) {
      return;
    }

    setData7122(getEip721DataByTemplate(eip721Template));
  }, [eip721Template]);
  const signUsingEthers = async () => {
    if (provider == null) {
      toast({
        title: 'Please connect wallet.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const signer = provider.getSigner();
    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    try {
      const flatSig = await signer._signTypedData(
        data7122.domain,
        types,
        data7122.message,
      );
      setSig(flatSig);
      const sig = splitSignature(flatSig);
      setRsvSig(sig);
      setVerifySigInput(flatSig);
      setSignTypedData(flatSig);
      setLoading(false);
    } catch (e) {
      toast({
        title: 'Provided chainId must match the active chainId in wallet',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const verify = async () => {
    if (verifySigInput == null) {
      return;
    }
    setLoading(true);
    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    const recoveredAddress = verifyTypedData(
      data7122.domain,
      types,
      data7122.message,
      verifySigInput,
    );
    setRecoveredAddr(recoveredAddress);
    setLoading(false);
  };
  return (
    <div className="mt-4">
      <h4>{loading}</h4>
      <div className="flex flex-row content-between">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <Label className="my-0">{'eth_signTypedData_v4'}</Label>
            <div className="my-4 ml-4">
              <Select
                onValueChange={(value) => {
                  setEip712Template(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta-tx">Meta Transaction</SelectItem>
                  <SelectItem value="aave-delegate-credit">
                    Aave Credit Delegation (Sepolia)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <JSONInput
            id="data7122"
            placeholder={data7122}
            height="320px"
            locale={locale}
            onChange={(event: any) => {
              if (event == null) {
                return;
              }
              setData7122(event.jsObject);
            }}
          />

          <Button onClick={signUsingEthers}>Sign</Button>
        </div>
        <div className="ml-4 flex flex-col">
          {sig && (
            <div className="mt-6">
              <div>
                <Label>Signature:</Label>
                <Textarea
                  className="w-96"
                  // width="480px"
                  contentEditable={false}
                  value={sig}
                />
              </div>
              <div>
                <Label>Split Signature:</Label>
                <Textarea
                  // width="480px"
                  className="w-96"
                  value={JSON.stringify(rsvSig)}
                  contentEditable={false}
                />
              </div>
              <div>
                <Input
                  placeholder="signature..."
                  className="w-96"
                  value={sig}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setVerifySigInput(event.target.value);
                  }}
                />
                <Button onClick={verify}>Verify</Button>
              </div>
              <div>
                <Label>
                  Signing Address: <strong>{address?.toLowerCase()}</strong>
                </Label>
              </div>
              {!!recoveredAddr && (
                <div>
                  {/* {recoveredAddr?.toLowerCase() == address?.toLowerCase() ? (
                    <CheckCircleIcon color="green.500" />
                  ) : (
                    <CloseIcon color="red.500" />
                  )} */}
                  <Label>
                    Recovered Address:
                    <strong>{recoveredAddr?.toLowerCase()}</strong>
                  </Label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
