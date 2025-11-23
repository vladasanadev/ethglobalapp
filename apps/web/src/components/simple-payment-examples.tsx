"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TransactionStatus } from "./transaction-status";
import { WalletConnect } from "./wallet-connect";
import {
  useCeloPayment,
  useCeloBalance,
  useTokenTransfer,
  useTokenBalance,
  CELO_TOKENS,
} from "@/hooks/use-simple-onchain";

/**
 * OPTION 1 EXAMPLES: Simple Onchain Interactions
 * 
 * These components demonstrate basic blockchain operations:
 * - Send CELO payments
 * - Check balances
 * - Transfer tokens
 */

/**
 * Example: Send CELO payment (tips, donations, payments)
 */
export function CeloPaymentExample() {
  const { isConnected } = useAccount();
  const [recipient, setRecipient] = useState("0x");
  const [amount, setAmount] = useState("0.01");
  const { sendPayment, hash, isPending, isConfirming, isSuccess, error } =
    useCeloPayment();

  const handleSend = async () => {
    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      alert("Invalid address");
      return;
    }
    try {
      await sendPayment(recipient as `0x${string}`, amount);
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Send CELO Payment</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Perfect for tips, donations, or simple payments
      </p>

      {!isConnected && (
        <div className="mb-4">
          <WalletConnect />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (CELO)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!isConnected || !recipient || !amount || isPending}
          className="w-full"
        >
          {isPending ? "Sending..." : `Send ${amount} CELO`}
        </Button>

        <TransactionStatus
          hash={hash}
          isPending={isPending}
          isConfirming={isConfirming}
          isSuccess={isSuccess}
          error={error}
          successMessage="Payment sent successfully!"
          errorMessage="Payment failed"
        />
      </div>
    </Card>
  );
}

/**
 * Example: Display CELO and cUSD balances
 */
export function BalanceDisplay() {
  const { address, isConnected } = useAccount();
  
  const celoBalance = useCeloBalance(address);
  const cusdBalance = useTokenBalance(
    CELO_TOKENS.sepolia.cUSD,
    address,
    6  // cUSD has 6 decimals
  );

  if (!isConnected) {
    return (
      <Card className="p-6">
        <WalletConnect />
      </Card>
    );
  }

  if (celoBalance.isLoading || cusdBalance.isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Loading balances...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Balances</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium">CELO</span>
          <span className="font-mono">
            {celoBalance.formatted} {celoBalance.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium">cUSD</span>
          <span className="font-mono">{cusdBalance.formatted} cUSD</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            celoBalance.refetch();
            cusdBalance.refetch();
          }}
          className="w-full"
        >
          Refresh Balances
        </Button>
      </div>
    </Card>
  );
}

/**
 * Example: Transfer cUSD tokens
 */
export function TokenTransferExample() {
  const { isConnected } = useAccount();
  const [recipient, setRecipient] = useState("0x");
  const [amount, setAmount] = useState("1");
  const { transferToken, hash, isPending, isConfirming, isSuccess, error } =
    useTokenTransfer();

  const handleTransfer = async () => {
    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      alert("Invalid address");
      return;
    }
    try {
      await transferToken(
        CELO_TOKENS.sepolia.cUSD,
        recipient as `0x${string}`,
        amount,
        6  // cUSD has 6 decimals
      );
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Transfer cUSD</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Send stablecoin payments with cUSD
      </p>

      {!isConnected && (
        <div className="mb-4">
          <WalletConnect />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (cUSD)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <Button
          onClick={handleTransfer}
          disabled={!isConnected || !recipient || !amount || isPending}
          className="w-full"
        >
          {isPending ? "Sending..." : `Send ${amount} cUSD`}
        </Button>

        <TransactionStatus
          hash={hash}
          isPending={isPending}
          isConfirming={isConfirming}
          isSuccess={isSuccess}
          error={error}
          successMessage="cUSD transferred successfully!"
          errorMessage="Transfer failed"
        />
      </div>
    </Card>
  );
}

/**
 * Example: Quick tip buttons
 */
export function QuickTipButtons({ recipientAddress }: { recipientAddress: `0x${string}` }) {
  const { isConnected } = useAccount();
  const { sendPayment, hash, isPending, isSuccess, error } = useCeloPayment();

  const tipAmounts = ["0.01", "0.05", "0.1", "0.5"];

  const handleTip = async (amount: string) => {
    try {
      await sendPayment(recipientAddress, amount);
    } catch (err) {
      console.error("Tip failed:", err);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Send a Tip</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tipAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            onClick={() => handleTip(amount)}
            disabled={isPending}
          >
            {amount} CELO
          </Button>
        ))}
      </div>
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        successMessage="Thank you for your tip! 🎉"
      />
    </Card>
  );
}


