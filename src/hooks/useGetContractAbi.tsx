import axios from 'axios';

const ETHERSCAN_V2_API_URL = 'https://api.etherscan.io/v2/api';

interface ChainConfig {
  apiKey: string;
}

const chainConfigs: { [chainId: number]: ChainConfig } = {
  1: {
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  },
  11155111: {
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  },
  137: {
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
  },
  42161: {
    apiKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY || '',
  },
  8453: {
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
  },
  84532: {
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
  },
  10: {
    apiKey: process.env.NEXT_PUBLIC_OPTIMISM_API_KEY || '',
  },
  31337: {
    apiKey: '',
  },
};

export const getContractAbi = async (
  contractAddress: string,
  chainId: number,
): Promise<any[] | null> => {
  const config = chainConfigs[chainId];

  if (!config) {
    return null;
  }

  let abiResponse;
  try {
    const response = await axios.get(ETHERSCAN_V2_API_URL, {
      params: {
        chainid: chainId,
        module: 'contract',
        action: 'getabi',
        address: contractAddress,
        apikey: config.apiKey,
      },
    });

    if (response.data.status === '1') {
      abiResponse = JSON.parse(response.data.result);

      return abiResponse;
    } else {
    }
  } catch (err) {
    console.error(err);
  } finally {
  }
  return null;
};
