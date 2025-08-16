import React, { useState } from 'react';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';
import { Label } from '@shadcn-components/ui/label';
import { Textarea } from '@shadcn-components/ui/textarea';

import { ethers } from 'ethers';
import { CopyIcon } from '@radix-ui/react-icons';

const EnsIntegrationTemplateComponent: React.FC = () => {
  const [contractName, setContractName] = useState<string>('MyContract');
  const [resolverAddress, setResolverAddress] = useState<string>(
    '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41', // Default: ENS Public Resolver (mainnet)
  );
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateCode = () => {
    // Reset states
    setError(null);
    setGeneratedCode('');

    // Validate inputs
    if (!contractName.trim()) {
      setError('Please enter a valid contract name.');
      return;
    }
    if (!ethers.isAddress(resolverAddress)) {
      setError('Please enter a valid Ethereum address for the ENS resolver.');
      return;
    }

    // Solidity code template
    const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";

contract ${contractName} {
    // ENS Resolver address (replace with desired resolver if different)
    address public constant ENS_RESOLVER = ${resolverAddress};
    Resolver private ensResolver;

    constructor() {
        ensResolver = Resolver(ENS_RESOLVER);
    }

    // Resolve an ENS name to an Ethereum address
    function resolveENSName(string memory ensName) public view returns (address) {
        bytes32 node = keccak256(abi.encodePacked(ensName));
        address resolvedAddr = ensResolver.addr(node);
        require(resolvedAddr != address(0), "ENS name not resolved");
        return resolvedAddr;
    }

    // Set a reverse record for this contract (only callable by owner)
    function setReverseRecord(string memory name) external {
        // Add access control (e.g., onlyOwner) as needed
        bytes32 node = keccak256(abi.encodePacked(name));
        ensResolver.setName(node, name);
    }

    // Optional: Update resolver address (only if needed)
    function updateResolver(address newResolver) external {
        // Add access control (e.g., onlyOwner) as needed
        require(newResolver != address(0), "Invalid resolver address");
        ensResolver = Resolver(newResolver);
    }
}
`;

    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    // Optional: Add toast notification here if shadcn-ui supports it
    alert('Code copied to clipboard!');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Smart Contract ENS Integration Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-2">
          <Label htmlFor="contractName">Contract Name</Label>
          <Input
            id="contractName"
            type="text"
            placeholder="e.g., MyContract"
            value={contractName}
            onChange={(e) => setContractName(e.target.value.trim())}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            The name of your Solidity smart contract.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resolverAddress">ENS Resolver Address</Label>
          <Input
            id="resolverAddress"
            type="text"
            placeholder="e.g., 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
            value={resolverAddress}
            onChange={(e) => setResolverAddress(e.target.value.trim())}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Default is the ENS Public Resolver on mainnet.
          </p>
        </div>

        {/* Generate Button */}
        <Button onClick={generateCode} className="w-full">
          Generate Code
        </Button>

        {/* Generated Code */}
        {generatedCode && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Generated Solidity Code:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center space-x-1"
              >
                <CopyIcon className="h-4 w-4" />
                <span>Copy</span>
              </Button>
            </div>
            <Textarea
              value={generatedCode}
              readOnly
              className="w-full h-64 font-mono text-sm bg-muted"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnsIntegrationTemplateComponent;
