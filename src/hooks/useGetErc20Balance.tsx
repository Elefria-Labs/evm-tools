import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const useGetErc20Balance = (
  tokenContractAddress: string,
  provider: ethers.JsonRpcProvider,
  spenderAddress?: string,
): { balance: string | null; allowance: string | null } => {
  const [balance, setBalance] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);

  useEffect(() => {
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() public view returns (uint8)',
        'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
      ],

      provider,
    );

    const fetchBalance = async () => {
      try {
        const accountAddress =  (await provider.getSigner()).address;
        //@ts-ignore
        const balanceResult = await tokenContract.balanceOf(accountAddress);
        //@ts-ignore
        const decimals = await tokenContract.decimals();
        const formattedBalance = ethers.formatUnits(
          balanceResult,
          decimals,
        );
        setBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching ERC20 token balance:', error);
        setBalance(null);
      }
    };

    const fetchAllowance = async (spender: string) => {
      try {
        const accountAddress = (await provider.getSigner()).address;
        //@ts-ignore
        const allowance = await tokenContract.allowance(
          accountAddress,
          spender,
        );
        //@ts-ignore
        const decimals = await tokenContract.decimals();
        const formattedBalance = ethers.formatUnits(allowance, decimals);
        setAllowance(formattedBalance);
      } catch (error) {
        console.error('Error fetching ERC20 token allowance:', error);
        setAllowance(null);
      }
    };
    if (spenderAddress != null) {
      fetchAllowance(spenderAddress);
    }

    fetchBalance();
  }, [tokenContractAddress, provider]);

  return { balance, allowance };
};
