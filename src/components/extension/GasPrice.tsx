import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function GasPrice() {
  const [gasFee, setGasFee] = useState<string | null>();

  useEffect(() => {
    const getGasFee = async () => {
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const gasFeeData = await provider.getFeeData();

      if (gasFeeData.gasPrice) {
        setGasFee(
          ethers
            .formatUnits(gasFeeData.gasPrice.toString(), 'gwei')
            .toString()
            .substring(0, 4),
        );
      }
    };
    getGasFee();
  }, []);
  return (
    <div className="flex flex-row">
      <p>Gas: {gasFee ? `${gasFee} Gwei` : 'Loading...'}</p>
    </div>
  );
}
