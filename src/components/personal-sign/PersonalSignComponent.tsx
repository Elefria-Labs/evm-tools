import React, { useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { Signature, verifyMessage } from 'ethers';


import { toastOptions } from '@components/common/toast';
import { useAccount, useChainId } from 'wagmi';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Label } from '@shadcn-components/ui/label';
import { useEthersSigner } from '@hooks/useEthersSigner';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';


type PersonalSignComponentPropsType = {};

const defaultMsg: string = 'Hello Ethereum!';

export default function PersonalSignComponent(
  _: PersonalSignComponentPropsType,
) {
  // const { provider } = props;
  const chainId = useChainId();
  const etherSigner = useEthersSigner({ chainId });
  const account = useAccount();

  const { toast } = useToast();

  const [verifySigInput, setVerifySigInput] = useState<string | undefined>();
  const [rsvSig, setRsvSig] = useState<Signature | undefined>();
  const [messageToSign, setMessageToSign] = useState<string>(defaultMsg);
  const [msgSignature, setMsgSignature] = useState<string | null>();

  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (msgSignature == null) {
      return;
    }
    const sig = Signature.from(msgSignature);
    setRsvSig(sig);
    setVerifySigInput(msgSignature);
  }, [msgSignature]);

  const signPersonalMessageUsingEthers = async () => {
    if (account == null) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet.',
      });
      return;
    }
    if (etherSigner?.signMessage == null) {
      return;
    }
    setLoading(true);

    const signature = await etherSigner.signMessage(messageToSign);
    setMsgSignature(signature);

    setLoading(false);
  };

  const verify = async () => {
    if (verifySigInput == null || msgSignature == null) {
      return;
    }
    setLoading(true);
    // const splitSig = Signature.from(verifySigInput);

    const recoveredAddress = verifyMessage(
      messageToSign,
      verifySigInput as string,
    );
    setRecoveredAddr(recoveredAddress);
    setLoading(false);
  };
  return (
    <div className="mt-4">
      <h4>{loading}</h4>
      <div className="flex flex-col sm:flex-row sm:justify-between md:flex-row md:justify-between">
        <div className="flex flex-col w-2/5 min-w-[240px]">
          <Label>Signing Message:</Label>
          <Textarea
            placeholder="message to sign..."
            className="h-96 min-w-[240px]"
            onChange={(event) => {
              if (event.target.value == null) {
                return;
              }
              setMessageToSign(event.target.value);
            }}
          />
          <Button onClick={signPersonalMessageUsingEthers}>Sign</Button>
        </div>
        {msgSignature && (
          <div className="flex flex-col  min-w-[240px] w-3/5 ml-4 mt-8 sm:mt-0">
            <div>
              <Label>
                <LockClosedIcon color="green.500" /> Signature:
              </Label>
              <Textarea contentEditable={false} value={msgSignature} />
            </div>
            <div>
              <Label>
                <LockClosedIcon color="green.500" /> Split Signature:
              </Label>
              <Textarea
                value={JSON.stringify(rsvSig)}
                contentEditable={false}
              />
            </div>
            <div>
              <Label>Verify Signature:</Label>
              <Input
                placeholder="signature..."
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setVerifySigInput(event.target.value);
                }}
              />
              <Button onClick={verify}>Verify</Button>
            </div>
            <div>
              <Label className="word-wrap">
                <CheckCircledIcon color="green.500" /> Signing Address:{' '}
                <strong>{account.address}</strong>
              </Label>
              {/* <Input value={account.address} disabled /> */}
            </div>
            {!!recoveredAddr && (
              <div>
                <Label>
                  {recoveredAddr?.toLowerCase() ==
                  account?.address?.toLowerCase() ? (
                    <CheckCircledIcon color="green.500" />
                  ) : (
                    <CrossCircledIcon color="red.500" />
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
