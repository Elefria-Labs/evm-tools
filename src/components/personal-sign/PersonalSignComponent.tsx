import React, { useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { splitSignature, verifyMessage } from 'ethers/lib/utils';
import { CheckCircleIcon, LockIcon, CloseIcon } from '@chakra-ui/icons';
import { SignatureLike } from '@ethersproject/bytes';
import { toastOptions } from '@components/common/toast';
import { useAccount, useSignMessage } from 'wagmi';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Label } from '@shadcn-components/ui/label';

type PersonalSignComponentPropsType = {};

const defaultMsg: string = 'Hello Ethereum!';

export function PersonalSignComponent(_: PersonalSignComponentPropsType) {
  // const { provider } = props;
  const account = useAccount();
  const { data: signMessageData, signMessage } = useSignMessage();
  const { toast } = useToast();

  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [messageToSign, setMessageToSign] = useState<string>(defaultMsg);

  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (signMessageData == null) {
      return;
    }
    const sig = splitSignature(signMessageData);
    setRsvSig(sig);
    setVerifySigInput(signMessageData);
  }, [signMessageData]);
  const signPersonalMessageUsingEthers = async () => {
    if (account == null) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet.',
      });
      return;
    }
    if (signMessage == null) {
      return;
    }
    setLoading(true);
    // const signer = await provider.getSigner();
    signMessage({ message: messageToSign });
    // setSig(flatSig);

    setLoading(false);
  };

  const verify = async () => {
    if (verifySigInput == null || signMessage == null) {
      return;
    }
    setLoading(true);
    const recoveredAddress = verifyMessage(messageToSign, verifySigInput);
    setRecoveredAddr(recoveredAddress);
    setLoading(false);
  };
  return (
    <div className="mt-4">
      <h4>{loading}</h4>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-2/5">
          <Label>Signing Message:</Label>
          <Textarea
            placeholder="message to sign..."
            className="h-96"
            onChange={(event) => {
              if (event.target.value == null) {
                return;
              }
              setMessageToSign(event.target.value);
            }}
          />
          <Button onClick={signPersonalMessageUsingEthers}>Sign</Button>
        </div>
        {signMessageData && (
          <div className="flex flex-col w-3/5 ml-4">
            <div>
              <Label>
                <LockIcon color="green.500" /> Signature:
              </Label>
              <Textarea contentEditable={false} value={signMessageData} />
            </div>
            <div>
              <Label>
                <LockIcon color="green.500" /> Split Signature:
              </Label>
              <Textarea
                value={JSON.stringify(rsvSig)}
                contentEditable={false}
              />
            </div>
            <div key={'verify'}>
              <Label>Verify Signature:</Label>
              <Input
                placeholder="signature..."
                width={'340px'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setVerifySigInput(event.target.value);
                }}
              />
              <Button onClick={verify}>Verify</Button>
            </div>
            <div>
              <Label>
                <CheckCircleIcon color="green.500" /> Signing Address:{' '}
                <strong>{account.address}</strong>
              </Label>
            </div>
            {!!recoveredAddr && (
              <div>
                <Label>
                  {recoveredAddr?.toLowerCase() ==
                  account?.address?.toLowerCase() ? (
                    <CheckCircleIcon color="green.500" />
                  ) : (
                    <CloseIcon color="red.500" />
                  )}{' '}
                  Recovered Address:
                  <strong>{recoveredAddr?.toLowerCase()}</strong>
                </Label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
