import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import JSONInput from 'react-json-editor-ajrm';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Label } from '@shadcn-components/ui/label';
// @ts-ignore
import * as locale from 'react-json-editor-ajrm/locale/en';

export default function TxDecoderComponent() {
  const [rawTx, setRawTx] = useState<string>('');
  const [decodedTx, setDecodedTx] = useState<ethers.Transaction | undefined>();
  const toast = useToast();

  const handleDecodeTx = () => {
    try {
      const tx = ethers.utils.parseTransaction(rawTx);
      setDecodedTx(tx);
    } catch (error) {
      setDecodedTx(undefined);
      toast({
        title: 'Error decoding transaction data. Please check input.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex sm:flex-col flex-row">
      {/* <Flex
        flexDirection={['column', 'column', 'row']}
        justifyContent="space-between"
      > */}
      <div className="sm:mt-4 w-96">
        <Label htmlFor="rawTx" className="mb-4">
          Raw Transaction Data
        </Label>
        <Textarea
          id="rawTx"
          // minW={[380, 380, 600]}
          // minH={[320, 320, 480]}
          className="w-96 sm:w-84 sm:h-380 h-96"
          placeholder="Enter raw transaction data"
          value={rawTx}
          onChange={(e) => setRawTx(e.target.value)}
        />

        <Button className="mt-4 w-full" color="black" onClick={handleDecodeTx}>
          Decode Transaction
        </Button>
      </div>
      {/* <Flex flexDirection="column" mt={[8, 8, 0]}> */}
      <div className="flex flex-col sm:mt-4">
        {decodedTx && (
          <>
            <Label htmlFor="rawTx" className="mb-4">
              Decoded Transaction Data
            </Label>
            <JSONInput placeholder={decodedTx} locale={locale} viewOnly />
          </>
        )}
      </div>
      {/* </Flex> */}
    </div>
  );
}
