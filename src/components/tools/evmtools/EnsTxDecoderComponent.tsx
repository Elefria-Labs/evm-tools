import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';

// https://discuss.ens.domains/t/testnet-deployment-addresses-holesky-and-sepolia/18667

// ENS Registrar and Resolver contract addresses (mainnet)
const ENS_REGISTRAR_ADDRESS =
  '0x253553366Da8546fC250F225fe3d25d0C782303b'.toLowerCase(); // ETHRegistrarController
const ENS_RESOLVER_ADDRESS =
  '0x8cab227b1162f03b8338331adaad7aadc83b895e'.toLowerCase(); // PublicResolver

// Basic ABI fragments for common ENS actions
const REGISTRAR_ABI = [
  'function register(string name, address owner, uint256 duration, bytes32 secret) external',
  'function renew(string name, uint256 duration) external',
];
const RESOLVER_ABI = [
  'function setAddr(bytes32 node, address addr) external',
  'function setText(bytes32 node, string key, string value) external',
];

const ENSTransactionDecoder: React.FC = () => {
  const [txHash, setTxHash] = useState<string>('');
  const [decodedResult, setDecodedResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize ethers provider
  const provider = ethers.getDefaultProvider('mainnet'); // Replace with your provider if needed

  const decodeTransaction = async () => {
    if (!txHash || !ethers.isHexString(txHash, 32)) {
      setError('Please enter a valid transaction hash (0x...).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDecodedResult(null);

    try {
      // Fetch transaction and receipt
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        setError('Transaction not found.');
        setIsLoading(false);
        return;
      }

      const toAddress = tx.to?.toLowerCase();
      const data = tx.data;

      if (!toAddress || !data) {
        setError('Transaction has no target or data.');
        setIsLoading(false);
        return;
      }

      let decodedAction: any = { type: 'Unknown ENS Action' };

      // Decode based on target contract
      if (toAddress === ENS_REGISTRAR_ADDRESS) {
        const iface = new ethers.Interface(REGISTRAR_ABI);
        const decoded = iface.parseTransaction({ data });

        if (decoded?.name === 'register') {
          decodedAction = {
            type: 'ENS Name Registration',
            name: decoded.args.name,
            owner: decoded.args.owner,
            duration: `${decoded.args.duration.toString()} seconds`,
          };
        } else if (decoded?.name === 'renew') {
          decodedAction = {
            type: 'ENS Name Renewal',
            name: decoded.args.name,
            duration: `${decoded.args.duration.toString()} seconds`,
          };
        }
      } else if (toAddress === ENS_RESOLVER_ADDRESS) {
        const iface = new ethers.Interface(RESOLVER_ABI);
        const decoded = iface.parseTransaction({ data });

        if (decoded?.name === 'setAddr') {
          decodedAction = {
            type: 'ENS Address Update',
            node: decoded.args.node,
            address: decoded.args.addr,
          };
        } else if (decoded?.name === 'setText') {
          decodedAction = {
            type: 'ENS Text Record Update',
            node: decoded.args.node,
            key: decoded.args.key,
            value: decoded.args.value,
          };
        }
      }
      if (!provider) {
        return null;
      }
      // Add basic tx info
      const result = {
        transactionHash: tx.hash,
        to: tx.to,
        // @ts-ignore
        gasUsed: (
          await provider?.getTransactionReceipt(txHash)
        ).gasUsed.toString(),
        decodedAction,
      };

      setDecodedResult(result);
    } catch (err) {
      setError('Failed to decode transaction. Ensure it’s an ENS-related tx.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>ENS Transaction Decoder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="Enter transaction hash (e.g., 0x...)"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value.trim())}
            disabled={isLoading}
            className="w-full"
          />
          <Button
            onClick={decodeTransaction}
            disabled={isLoading || !txHash}
            className="w-full"
          >
            {isLoading ? <>Decoding...</> : 'Decode'}
          </Button>
        </div>

        {decodedResult && (
          <div className="p-4 bg-muted rounded-md space-y-2">
            <p className="text-sm font-medium">Transaction Hash:</p>
            <p className="text-sm break-all">{decodedResult.transactionHash}</p>
            <p className="text-sm font-medium">To:</p>
            <p className="text-sm break-all">{decodedResult.to}</p>
            <p className="text-sm font-medium">Gas Used:</p>
            <p className="text-sm">{decodedResult.gasUsed}</p>
            <p className="text-sm font-medium">Decoded Action:</p>
            <div className="text-sm">
              <p>Type: {decodedResult.decodedAction.type}</p>
              {Object.entries(decodedResult.decodedAction).map(([key, value]) =>
                key !== 'type' ? (
                  <p key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                    {String(value)}
                  </p>
                ) : null,
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ENSTransactionDecoder;
