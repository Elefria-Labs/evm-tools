import React, { useState, useCallback } from 'react';
import { useAccount, useSignTypedData, useChainId } from 'wagmi';
import {
  Eip7702Authorization,
  AuthorizationStatus,
  Eip7702Error,
  Eip7702AuthorizationSigned,
} from '../types/eip7702.types';
import {
  createEip7702TypedData,
  validateCodeAddress,
  validateChainId,
  validateNonce,
  formatAuthorizationForSigning,
  parseSignature,
  recoverAuthorizationSigner,
} from '../utils/eip7702.utils';

export function useEip7702() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    signTypedData,
    data: signature,
    error: signError,
  } = useSignTypedData();

  const [status, setStatus] = useState<AuthorizationStatus>('idle');
  const [error, setError] = useState<Eip7702Error | null>(null);
  const [currentAuthorization, setCurrentAuthorization] =
    useState<Eip7702Authorization | null>(null);
  const [signedAuthorization, setSignedAuthorization] =
    useState<Eip7702AuthorizationSigned | null>(null);

  const createAuthorization = useCallback(
    async (codeAddress: string, nonce: number, targetChainId?: number) => {
      try {
        setStatus('signing');
        setError(null);

        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        const authChainId = targetChainId || chainId;

        if (!validateCodeAddress(codeAddress)) {
          throw new Error('Invalid code address');
        }

        if (!validateChainId(authChainId)) {
          throw new Error('Invalid chain ID');
        }

        if (!validateNonce(nonce)) {
          throw new Error('Invalid nonce');
        }

        const authorization = formatAuthorizationForSigning(
          codeAddress,
          authChainId,
          nonce,
        );
        const typedData = createEip7702TypedData(authorization, authChainId);

        setCurrentAuthorization(authorization);

        await signTypedData({
          domain: typedData.domain,
          types: { Authorization: typedData.types.Authorization },
          primaryType: typedData.primaryType,
          message: typedData.message,
        });

        setStatus('pending');
      } catch (err: any) {
        setError({
          code: 'AUTHORIZATION_FAILED',
          message: err.message || 'Failed to create authorization',
          details: err,
        });
        setStatus('error');
      }
    },
    [isConnected, address, chainId, signTypedData],
  );

  const verifyAuthorization = useCallback(
    (
      authorization: Eip7702Authorization,
      sig: string,
      targetChainId?: number,
    ) => {
      try {
        const authChainId = targetChainId || chainId;
        const recoveredAddress = recoverAuthorizationSigner(
          authorization,
          sig,
          authChainId,
        );
        return {
          isValid: true,
          signer: recoveredAddress,
          matches: recoveredAddress.toLowerCase() === address?.toLowerCase(),
        };
      } catch (err: any) {
        return {
          isValid: false,
          error: err.message,
        };
      }
    },
    [chainId, address],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setCurrentAuthorization(null);
    setSignedAuthorization(null);
  }, []);

  // Handle signature completion
  React.useEffect(() => {
    if (signature && currentAuthorization && status === 'pending') {
      try {
        const parsedSig = parseSignature(signature);
        const signed: Eip7702AuthorizationSigned = {
          ...currentAuthorization,
          ...parsedSig,
        };
        setSignedAuthorization(signed);
        setStatus('success');
      } catch (err: any) {
        setError({
          code: 'SIGNATURE_PARSING_FAILED',
          message: 'Failed to parse signature',
          details: err,
        });
        setStatus('error');
      }
    }
  }, [signature, currentAuthorization, status]);

  // Handle signing errors
  React.useEffect(() => {
    if (signError) {
      setError({
        code: 'SIGNING_FAILED',
        message: signError.message || 'Failed to sign authorization',
        details: signError,
      });
      setStatus('error');
    }
  }, [signError]);

  return {
    status,
    error,
    signature,
    currentAuthorization,
    signedAuthorization,
    createAuthorization,
    verifyAuthorization,
    reset,
    isConnected,
    address,
    chainId,
  };
}
