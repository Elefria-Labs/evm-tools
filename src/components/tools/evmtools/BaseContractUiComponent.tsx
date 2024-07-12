import React, { useState, useEffect } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { useChainId } from 'wagmi';
import useGetContractAbi from '@hooks/useGetContractAbi';
import { Textarea } from '@shadcn-components/ui/textarea';
import ContractUiComponent from './ContractUi/ContractUiComponent';

const BaseContractUiComponent = () => {
  const [debugAddress, setDebugAddress] = useState<string>(
    '0xc3De830EA07524a0761646a6a4e4be0e114a3C83',
  );
  const [debugAbi, setDebugAbi] = useState<string>('');
  const [parsedDebugAbi, setParsedDebugAbi] = useState<any[]>([]);
  const [parseError, setAbiParseError] = useState<string>('');
  const chainId = useChainId();
  const {
    abi: contractAbi,
    error,
    loading,
  } = useGetContractAbi(debugAddress, chainId);

  useEffect(() => {
    if (debugAbi == null) {
      return;
    }
    try {
      setParsedDebugAbi(JSON.parse(debugAbi));
      setAbiParseError('');
    } catch (e) {
      setAbiParseError(
        'Invalid ABI, please provide the ABI in the correct format!',
      );
    }
  }, [debugAbi]);

  console.log('contractAbi', contractAbi);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Contract Interaction</h1>
      <Input
        value={debugAddress}
        onChange={(e) => setDebugAddress(e.target.value)}
        placeholder="Contract address"
      />
      {error && <p>{error}</p>}
      {contractAbi ? (
        <Textarea
          className="my-8 h-[80px]"
          placeholder="Provide contract abi"
          value={JSON.stringify(contractAbi)}
          disabled
        />
      ) : (
        <>
          <Textarea
            className="my-8"
            placeholder="Provide contract abi"
            value={debugAbi}
            onChange={(e) => setDebugAbi(e.target.value)}
          />
          {parseError}
          {/* <Button onClick={() => {}}>Submit</Button> */}
        </>
      )}
      {chainId == null && 'Please connect your wallet!'}

      {(contractAbi || (debugAbi && !parseError)) && debugAddress && (
        <ContractUiComponent
          abi={contractAbi ?? parsedDebugAbi}
          contractAddress={debugAddress}
        />
      )}
    </div>
  );
};

export default BaseContractUiComponent;
