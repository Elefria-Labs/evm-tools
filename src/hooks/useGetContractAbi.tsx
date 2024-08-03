import axios from 'axios';

interface ChainConfig {
  apiUrl: string;
  apiKey: string;
}

const chainConfigs: { [chainId: number]: ChainConfig } = {
  1: {
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  },
  11155111: {
    apiUrl: 'https://api-sepolia.etherscan.io/api',
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  },
  137: {
    apiUrl: 'https://api.polygonscan.com/api',
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
  },
  42161: {
    apiUrl: 'https://api.arbiscan.io/api',
    apiKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY || '',
  },
  8453: {
    apiUrl: 'https://api.basescan.org/api',
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
  },
  84532: {
    apiUrl: 'https://api-sepolia.basescan.org/api',
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '',
  },
  10: {
    apiUrl: 'https://api-optimistic.etherscan.io/api',
    apiKey: process.env.NEXT_PUBLIC_OPTIMISM_API_KEY || '',
  },
  31337: {
    apiUrl: 'http://127.0.0.1:8545/',
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
    const response = await axios.get(config.apiUrl, {
      params: {
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
