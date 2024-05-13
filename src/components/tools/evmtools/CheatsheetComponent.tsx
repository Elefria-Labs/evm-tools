import { useCallback, useEffect, useState } from 'react';
import { IconButton, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn-components/ui/select';

import { integerList } from '@data/integer-list';
import { CopyIcon } from '@chakra-ui/icons';
import { handleCopyClick } from '@utils/wallet';
import { ethers } from 'ethers';
import InputBaseCopy from '@components/common/BaseInputCopy';
import EtherUnitsTable from './Cheatsheet/EtherUnitsTable';

export default function CheatsheetComponent() {
  const [minMaxValue, setMinMaxValue] = useState<{
    min?: string;
    max: string;
  } | null>();
  const [dataType, setDataType] = useState<string | null>();

  const getMaxMinValue = useCallback((bits: number, intType: string) => {
    if (intType.includes('uint') == false) {
      const min = ethers.BigNumber.from('2')
        .pow(BigInt(bits - 1))
        .mul(-1)
        .toString();
      const max = ethers.BigNumber.from('2')
        .pow(BigInt(bits - 1))
        .sub(1)
        .toString();
      setMinMaxValue({ min, max });
      return;
    }
    const maxValue = ethers.BigNumber.from('2').pow(BigInt(bits)).sub(1);
    setMinMaxValue({ max: maxValue.toString() });
  }, []);
  useEffect(() => {
    if (dataType == null) {
      return;
    }
    const intType = dataType?.split('-')?.[0]!;
    const bits = Number(dataType?.split('-')?.[1]);

    getMaxMinValue(bits, intType);
  }, [dataType, getMaxMinValue]);

  return (
    <div>
      <div className="mb-4">
        <Label>Integer Type</Label>
        <Select
          onValueChange={(value) => {
            setDataType(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select integer type" />
          </SelectTrigger>
          <SelectContent>
            {integerList.map((o) => (
              <SelectItem key={o.option} value={o.value}>
                {o.option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {minMaxValue?.min && (
          <>
            <Label>Min Value</Label>
            <InputGroup>
              <Input type="text" value={minMaxValue?.min} disabled />
              <InputRightElement>
                <IconButton
                  aria-label="Copy int value"
                  icon={<CopyIcon />}
                  onClick={() => handleCopyClick(minMaxValue.min)}
                />
              </InputRightElement>
            </InputGroup>
          </>
        )}
        {minMaxValue?.max && (
          <>
            <Label>Max Value</Label>
            <InputBaseCopy
              onClick={() => handleCopyClick(minMaxValue.max)}
              value={minMaxValue?.max}
              disabled
            />
          </>
        )}
      </div>

      <div>
        <Label>Zero Address</Label>
        <InputBaseCopy
          onClick={() => handleCopyClick(ethers.constants.AddressZero)}
          value={ethers.constants.AddressZero}
          disabled
        />
      </div>
      <div>
        <EtherUnitsTable />
      </div>
    </div>
  );
}
