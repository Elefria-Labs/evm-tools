import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useGetCoinPrice } from '@hooks/useGetCoinPrice';
import { useGetBaseFee } from '@hooks/useGetBaseFee';
import { Label } from '@shadcn-components/ui/label';
import InputBaseCopy from '@components/common/BaseInputCopy';
import { toastOptions } from '@components/common/toast';
import { useToast } from '@shadcn-components/ui/use-toast';

function calculateValue(ethAmount: string, gasPrice: string): string {
  let value;
  try {
    const ethValue = ethers.parseEther(ethAmount.toString());
    value = ethValue * ethers.parseUnits(gasPrice.toString(), 18);
  } catch (e) {
    return ethers.formatUnits(0, 18 * 2);
  }

  return ethers.formatUnits(value, 18 * 2);
}

export default function GasConverterComponent() {
  const [weiValue, setWeiValue] = useState<string>('');
  const [gweiValue, setGweiValue] = useState<string>('');
  const [ethValue, setEthValue] = useState<string>('');
  const toast = useToast();

  const {
    data: ethPrice,
    // loading: isPriceLoading,
    // error: priceError,
  } = useGetCoinPrice(['eth']);
  const isValid = (value: string) => {
    return !(value == '' || BigInt(value) < 0);
  };
  const { gasDetails } = useGetBaseFee();

  const handleWeiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const weiValue = event.target.value;
      if (!isValid(weiValue)) {
        return;
      }
      setWeiValue(weiValue);
      const gweiValue = ethers.formatUnits(weiValue.toString(), 'gwei');
      setGweiValue(gweiValue);
      const eth = ethers.formatUnits(weiValue.toString(), 'ether');
      setEthValue(eth);
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleGweiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gweiValue = event.target.value;

    setGweiValue(gweiValue);
    try {
      const weiValue = ethers.parseUnits(gweiValue, 'gwei');
      setWeiValue(weiValue.toString());
      const ethValue = ethers.formatEther(weiValue);
      setEthValue(ethValue);
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Invalid input',
      });
      return;
    }
  };

  const handleEthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ethValue = event.target.value;

    setEthValue(ethValue);
    let weiValue;
    try {
      weiValue = ethers.parseEther(ethValue);
      setWeiValue(weiValue.toString());
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Invalid input',
      });
      return;
    }

    const gweiValue = ethers.formatUnits(weiValue, 'gwei');
    setGweiValue(gweiValue);
  };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  useEffect(() => {
    const weiValue = ethers.parseEther('0.01');
    setWeiValue(weiValue.toString());
    const gweiValue = ethers.formatUnits(weiValue, 'gwei');
    setGweiValue(gweiValue);
    setEthValue('0.01');
  }, []);

  return (
    <div className="flex flex-col">
      <div>
        <Label htmlFor="wei-input">{'Wei'}</Label>
        <div>
          <InputBaseCopy
            value={weiValue}
            onClick={() => handleCopyClick(weiValue)}
            onChange={handleWeiChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gwei-input">{'Gwei'}</Label>
        <div>
          <InputBaseCopy
            value={gweiValue}
            onClick={() => handleCopyClick(gweiValue)}
            onChange={handleGweiChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="eth-input">{'Eth'}</Label>
        <div>
          <InputBaseCopy
            value={ethValue}
            onClick={() => handleCopyClick(ethValue)}
            onChange={handleEthChange}
          />
        </div>
      </div>
      {!!ethPrice?.[0] && (
        <div>
          <Label htmlFor="eth-input">{'Eth Price'}</Label>
          <div>
            <InputBaseCopy
              value={ethPrice[0]?.data.amount}
              disabled
              onClick={() =>
                handleCopyClick(ethPrice[0]?.data.amount.toString()!)
              }
            />
          </div>
        </div>
      )}
      {!!gasDetails && (
        <div>
          <Label htmlFor="eth-input">{'Suggested Base Fee'}</Label>
          <div>
            <InputBaseCopy
              value={ethers
                .formatUnits(gasDetails.gasPrice.toString(), 'gwei')
                .toString()
                .substring(0, 4)}
              disabled
              onClick={() => handleCopyClick(ethValue)}
            />
          </div>
        </div>
      )}
      {!!gasDetails && ethValue && (
        <div>
          <Label htmlFor="eth-input">{'Total Gas Cost'}</Label>
          <div>
            <InputBaseCopy
              value={calculateValue(
                ethValue.toString(),
                gasDetails.gasPrice.toString(),
              )}
              disabled
              onClick={() =>
                handleCopyClick(
                  calculateValue(
                    ethValue.toString(),
                    gasDetails.gasPrice.toString(),
                  ),
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
