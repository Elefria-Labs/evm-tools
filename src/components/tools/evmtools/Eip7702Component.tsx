import React, { useState, useEffect } from 'react';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import { Textarea } from '@shadcn-components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';
import { Badge } from '@shadcn-components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn-components/ui/select';
import { useToast } from '@shadcn-components/ui/use-toast';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  LockClosedIcon,
  ReloadIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { toastOptions } from '@components/common/toast';
import { useEip7702 } from '../../../hooks/useEip7702';
import {
  DEFAULT_TEMPLATES,
  getTemplateById,
  formatAuthorizationTuple,
} from '../../../utils/eip7702.utils';
import { getExplorerUrl, getChainName } from '../../../utils/chain.utils';
import InputBaseCopy from '@components/common/BaseInputCopy';

export default function Eip7702Component() {
  const { toast } = useToast();
  const {
    status,
    error,
    signature,
    signedAuthorization,
    createAuthorization,
    verifyAuthorization,
    reset,
    isConnected,
    address,
    chainId,
  } = useEip7702();

  const [codeAddress, setCodeAddress] = useState('');
  const [nonce, setNonce] = useState('0');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customChainId, setCustomChainId] = useState('');

  // Verification inputs
  const [verifyCodeAddress, setVerifyCodeAddress] = useState('');
  const [verifyNonce, setVerifyNonce] = useState('0');
  const [verifyChainId, setVerifyChainId] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    if (error) {
      toast({
        ...toastOptions,
        title: 'Error',
        description: error.message,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (status === 'success' && signedAuthorization) {
      toast({
        ...toastOptions,
        title: 'Authorization Signed Successfully',
        description: 'EIP-7702 authorization signature created',
      });
    }
  }, [status, signedAuthorization, toast]);

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setCodeAddress(template.codeAddress);
      setSelectedTemplate(templateId);
    }
  };

  const handleCreateAuthorization = async () => {
    if (!codeAddress.trim()) {
      toast({
        ...toastOptions,
        title: 'Code Address Required',
        description: 'Please enter a valid code address',
      });
      return;
    }

    const nonceNum = parseInt(nonce);
    const targetChainId = customChainId ? parseInt(customChainId) : chainId;

    await createAuthorization(codeAddress.trim(), nonceNum, targetChainId);
  };

  const handleVerifySignature = () => {
    if (!verifyCodeAddress || !verifySignature) {
      toast({
        ...toastOptions,
        title: 'Missing Information',
        description: 'Please provide code address and signature',
      });
      return;
    }

    const authorization = {
      chainId: BigInt(verifyChainId || chainId),
      address: verifyCodeAddress,
      nonce: BigInt(verifyNonce || 0),
    };

    const result = verifyAuthorization(
      authorization,
      verifySignature,
      verifyChainId ? parseInt(verifyChainId) : chainId,
    );

    setVerificationResult(result);
  };

  const handleReset = () => {
    reset();
    setVerificationResult(null);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">EIP-7702 Account Abstraction</h2>
        <Button variant="outline" onClick={handleReset}>
          <ReloadIcon className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {!isConnected && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              Please connect your wallet to create EIP-7702 authorizations
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authorization Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockClosedIcon className="w-5 h-5" />
              Create Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Template (Optional)</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template or enter custom address" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        {template.name}
                        {template.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-sm text-gray-600 mt-1">
                  {getTemplateById(selectedTemplate)?.description}
                </p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2">
                Code Address *
                {codeAddress && (
                  <a
                    href={getExplorerUrl(
                      customChainId ? parseInt(customChainId) : chainId || 1,
                      codeAddress,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                    title={`View on ${getChainName(
                      customChainId ? parseInt(customChainId) : chainId || 1,
                    )} Explorer`}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                )}
              </Label>
              <Input
                value={codeAddress}
                onChange={(e) => setCodeAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nonce</Label>
                <Input
                  type="number"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <Label>Chain ID (Optional)</Label>
                <Input
                  type="number"
                  value={customChainId}
                  onChange={(e) => setCustomChainId(e.target.value)}
                  placeholder={chainId?.toString()}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateAuthorization}
              disabled={
                !isConnected || status === 'signing' || status === 'pending'
              }
              className="w-full"
            >
              {status === 'signing' || status === 'pending' ? (
                <>
                  <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                  {status === 'signing' ? 'Signing...' : 'Processing...'}
                </>
              ) : (
                'Create Authorization'
              )}
            </Button>

            {isConnected && (
              <div className="text-sm text-gray-600">
                <p>Connected: {address}</p>
                <p>Chain ID: {chainId}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signature Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircledIcon className="w-5 h-5" />
              Verify Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                Code Address
                {verifyCodeAddress && (
                  <a
                    href={getExplorerUrl(
                      verifyChainId ? parseInt(verifyChainId) : chainId || 1,
                      verifyCodeAddress,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                    title={`View on ${getChainName(
                      verifyChainId ? parseInt(verifyChainId) : chainId || 1,
                    )} Explorer`}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                )}
              </Label>
              <Input
                value={verifyCodeAddress}
                onChange={(e) => setVerifyCodeAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nonce</Label>
                <Input
                  type="number"
                  value={verifyNonce}
                  onChange={(e) => setVerifyNonce(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <Label>Chain ID</Label>
                <Input
                  type="number"
                  value={verifyChainId}
                  onChange={(e) => setVerifyChainId(e.target.value)}
                  placeholder={chainId?.toString()}
                />
              </div>
            </div>

            <div>
              <Label>Signature</Label>
              <Textarea
                value={verifySignature}
                onChange={(e) => setVerifySignature(e.target.value)}
                placeholder="0x..."
                className="font-mono"
                rows={3}
              />
            </div>

            <Button onClick={handleVerifySignature} className="w-full">
              Verify Signature
            </Button>

            {verificationResult && (
              <div
                className={`border rounded-lg p-3 ${
                  verificationResult.isValid
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {verificationResult.isValid ? (
                    <CheckCircledIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <CrossCircledIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium text-black">
                    {verificationResult.isValid
                      ? 'Valid Signature'
                      : 'Invalid Signature'}
                  </span>
                </div>
                {verificationResult.signer && (
                  <div className="mt-2 text-sm text-black">
                    <p>
                      Signer:{' '}
                      <code className="font-mono">
                        {verificationResult.signer}
                      </code>
                    </p>
                    {verificationResult.matches !== undefined && (
                      <p
                        className={
                          verificationResult.matches
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {verificationResult.matches
                          ? '✓ Matches connected wallet'
                          : '✗ Does not match connected wallet'}
                      </p>
                    )}
                  </div>
                )}
                {verificationResult.error && (
                  <p className="text-sm text-red-600 mt-2">
                    {verificationResult.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {(signature || signedAuthorization) && (
        <Card>
          <CardHeader>
            <CardTitle>Authorization Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {signature && (
              <div>
                <Label>Raw Signature</Label>
                <InputBaseCopy value={signature} disabled />
              </div>
            )}

            {signedAuthorization && (
              <div>
                <Label>Authorization Tuple (for contract calls)</Label>
                <InputBaseCopy
                  value={formatAuthorizationTuple(signedAuthorization)}
                  disabled
                />
              </div>
            )}

            {signedAuthorization && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Chain ID</Label>
                  <InputBaseCopy
                    value={signedAuthorization.chainId.toString()}
                    disabled
                  />
                </div>
                <div>
                  <Label>Nonce</Label>
                  <InputBaseCopy
                    value={signedAuthorization.nonce.toString()}
                    disabled
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
