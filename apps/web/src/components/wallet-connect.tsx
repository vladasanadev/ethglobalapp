"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { Button } from "./ui/button";

/**
 * Wallet connection component for Farcaster Mini Apps
 * Automatically connects to the user's wallet without showing a wallet selection dialog
 * 
 * Based on: https://miniapps.farcaster.xyz/docs/guides/wallets
 */
export function WalletConnect() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Auto-connect on mount if not connected
  useEffect(() => {
    if (!isConnected && !isConnecting && connectors.length > 0) {
      // Automatically attempt to connect to the Farcaster wallet
      connect({ connector: connectors[0] });
    }
  }, [isConnected, isConnecting, connectors, connect]);

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm">Connecting wallet...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Connected
            </span>
            <span className="text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="w-full"
    >
      Connect Wallet
    </Button>
  );
}

/**
 * Simplified inline wallet status component
 */
export function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-xs text-gray-500">
        Wallet not connected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-xs font-mono">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
    </div>
  );
}


