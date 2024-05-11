import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

// type WalletConnectBaseProps = {
//   connectWallet: () => void;
//   disconnectWallet: () => void;
//   connectedAccount?: string;
// };

export default function WalletConnectBase() {
  return (
    <div className="flex flex-row content-center justify-end">
      <div className="ml-4 flex flex-row justify-end">
        {/* {!connectedAccount ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <Button onClick={disconnectWallet}>Disconnect</Button>
        )} */}
        <ConnectButton />
      </div>
    </div>
  );
}
