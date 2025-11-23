"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  hash?: `0x${string}`;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  chainId?: number;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Transaction status component with visual feedback
 * Shows loading, success, and error states for blockchain transactions
 */
export function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  error,
  chainId = 11142220, // Celo Sepolia default
  successMessage = "Transaction successful!",
  errorMessage = "Transaction failed",
}: TransactionStatusProps) {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (isPending || isConfirming || isSuccess || error) {
      setShowStatus(true);
    }
    
    // Auto-hide success message after 5 seconds
    if (isSuccess) {
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isPending, isConfirming, isSuccess, error]);

  if (!showStatus) return null;

  const getExplorerUrl = () => {
    const explorers: Record<number, string> = {
      42220: "https://explorer.celo.org/mainnet",
      44787: "https://explorer.celo.org/alfajores",
      11142220: "https://celo-sepolia.blockscout.com",
    };
    return explorers[chainId] || explorers[11142220];
  };

  // Error state
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 dark:text-red-100">
              {errorMessage}
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess && hash) {
    return (
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              {successMessage}
            </h4>
            <a
              href={`${getExplorerUrl()}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-700 dark:text-green-300 hover:underline mt-1"
            >
              View on Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading states
  const loadingMessage = isConfirming
    ? "Confirming transaction..."
    : "Sending transaction...";

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {loadingMessage}
          </p>
          {hash && (
            <a
              href={`${getExplorerUrl()}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 hover:underline mt-1"
            >
              View transaction
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple inline transaction hash display
 */
export function TransactionHash({ hash }: { hash?: `0x${string}` }) {
  if (!hash) return null;

  return (
    <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
      Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
    </div>
  );
}


