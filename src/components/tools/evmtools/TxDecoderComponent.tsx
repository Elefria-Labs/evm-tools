import React, { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ethers } from 'ethers';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Label } from '@shadcn-components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@shadcn-components//ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shadcn-components/ui/table';
import JSONInput from 'react-json-editor-ajrm';

// @ts-ignore
import * as locale from 'react-json-editor-ajrm/locale/en';

export default function TxDecoderComponent() {
  const [rawTx, setRawTx] = useState<string>('');
  const [decodedTx, setDecodedTx] = useState<ethers.Transaction | null>();
  const { toast } = useToast();

  const handleDecodeTx = () => {
    try {
      const tx = ethers.Transaction.from(rawTx);
      setDecodedTx(tx);
    } catch (error) {
      setDecodedTx(null);
      toast({
        title: 'Error decoding transaction data. Please check input.',
      });
    }
  };

  const renderDecodedTxTable = () => {
    if (!decodedTx) return null;
    const entries = Object.entries(decodedTx);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{value?.toString() || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col w-full">
        <Label className="mb-4">Raw Transaction Data</Label>
        <Textarea
          id="rawTx"
          rows={10}
          className="w-full sm:w-84"
          placeholder="Enter raw transaction data"
          value={rawTx}
          onChange={(e) => setRawTx(e.target.value)}
        />
        <Button className="mt-4 w-full" onClick={handleDecodeTx}>
          Decode Transaction
        </Button>
      </div>
      {decodedTx && (
        <div className="flex flex-col sm:mt-4">
          <Label htmlFor="rawTx" className="mb-4">
            Decoded Transaction Data
          </Label>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="decoded-tx">
              <AccordionTrigger>View Raw decoded</AccordionTrigger>
              <AccordionContent>
                <JSONInput placeholder={decodedTx} locale={locale} viewOnly />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {decodedTx && (
        <div className="mt-8">
          <Label className="mb-4">Transaction Fields</Label>
          {renderDecodedTxTable()}
        </div>
      )}
    </div>
  );
}
