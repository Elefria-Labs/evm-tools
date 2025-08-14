import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export interface CoinbaseResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export const useGetBaseFee = () => {
  const [gasDetails, setGasDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const getGasFee = async () => {
      // TODO
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const gasFeeData = await provider.getFeeData();

      if (gasFeeData.gasPrice) {
        setGasDetails(gasFeeData);
        setLoading(false);
      }
    };
    if (!gasDetails) {
      getGasFee();
      setLoading(true);
    }
  }, [gasDetails]);

  return { gasDetails, loading, error };
};
