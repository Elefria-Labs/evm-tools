import React, { useEffect, useState } from 'react';

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
import { useToast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import { useAccount, useSignTypedData } from 'wagmi';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';

const locale = require('react-json-editor-ajrm/locale/en');

export default function Eip712PlaygroundComponent() {
  // const { provider, address } = props;
  const account = useAccount();

  const { toast } = useToast();
  const {
    data: eip712Signature,
    signTypedData,
    error: signTypedDataError,
  } = useSignTypedData();

  const [eip721Template, setEip712Template] = useState<string>('');
  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [data7122, setData7122] = useState<
    GenericData712Type<
      Record<string, string | number>,
      Record<string, string | number>
    >
  >(getEip721DataByTemplate('default'));
  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [_, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (eip721Template == null) {
      return;
    }

    setData7122(getEip721DataByTemplate(eip721Template));
  }, [eip721Template]);
  const signUsingEthers = async () => {
    if (!account.isConnected) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet.',
      });
      return;
    }
    setLoading(true);

    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    try {
      signTypedData({
        domain: data7122.domain,
        types: types as any, // TODO
        primaryType: data7122.primaryType,
        message: data7122.message,
      });

      setLoading(false);
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Provided chainId must match the active chainId in wallet',
      });
    }
  };
  useEffect(() => {
    if (signTypedDataError == null) {
      return;
    }

    toast({
      ...toastOptions,
      title:
        'Provided chainId must match the active chainId in wallet or invalid EIP-712 msg format',
    });
  }, [signTypedDataError, toast]);
  useEffect(() => {
    if (eip712Signature == null) {
      return;
    }
    const sig = splitSignature(eip712Signature);
    setRsvSig(sig);
    setVerifySigInput(eip712Signature);
  }, [eip712Signature]);

  const verify = async () => {
    if (verifySigInput == null) {
      return;
    }
    setRecoveredAddr('');
    setLoading(true);
    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    try {
      const recoveredAddress = verifyTypedData(
        data7122.domain,
        types,
        data7122.message,
        verifySigInput,
      );
      setRecoveredAddr(recoveredAddress);
    } catch (e) {
      toast({ ...toastOptions, title: 'Invalid signature!' });
    }

    setLoading(false);
  };
  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row content-between">
        <div className="flex flex-col w-2/5 min-w-[240px] sm:max-w-full ">
          <div className="flex flex-col sm:flex-row  sm:justify-center">
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
                  <SelectItem value="permit2">Permit2 Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <JSONInput
            id="data7122"
            placeholder={data7122}
            width="100%"
            height="320px"
            locale={locale}
            onBlur={(event: any) => {
              if (event == null) {
                return;
              }
              setData7122(event.jsObject);
            }}
            // onChange={(event: any) => {
            //   if (event == null) {
            //     return;
            //   }
            //   console.log('event.jsObject', event.jsObject);
            //   setData7122(event.jsObject);
            // }}
          />
          <a
            href="https://github.com/Elefria-Labs/evm-tools/issues/new"
            target="_blank"
          >
            <p className="text-xs hover:underline-offset-4 underline decoration-sky-500 italic">
              {'I want to submit a template.'}
            </p>
          </a>
          <Button onClick={signUsingEthers}>Sign</Button>
        </div>
        <div className="ml-4 flex flex-col min-w-[240px] w-3/5 mt-8 sm:mt-0">
          {eip712Signature && (
            <div className="mt-6">
              <div>
                <Label>
                  <LockClosedIcon /> Signature:
                </Label>
                <Textarea contentEditable={false} value={eip712Signature} />
              </div>
              <div className="mt-2">
                <Label>
                  <LockClosedIcon /> Split Signature:
                </Label>
                <Textarea
                  value={JSON.stringify(rsvSig)}
                  contentEditable={false}
                />
              </div>
              <div className="mt-2">
                <Label>Verify Signature:</Label>
                <Input
                  placeholder="signature..."
                  value={verifySigInput as string}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setVerifySigInput(event.target.value);
                  }}
                />
                <Button onClick={verify}>Verify Signature</Button>
              </div>
              <div className="mt-2">
                <Label>
                  Signing Address:&nbsp;
                  <strong>{account?.address?.toLowerCase()}</strong>
                </Label>
              </div>
              {!!recoveredAddr && (
                <div>
                  <Label>
                    {recoveredAddr?.toLowerCase() ==
                    account?.address?.toLowerCase() ? (
                      <CheckCircledIcon />
                    ) : (
                      <CrossCircledIcon />
                    )}
                    Recovered Address:&nbsp;
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
