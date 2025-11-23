"use client";

import { 
  useSendTransaction, 
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { parseEther, parseUnits, formatEther } from "viem";

/**
 * OPTION 1: Simple Onchain Interactions
 * 
 * These hooks provide basic blockchain operations:
 * - Send CELO payments
 * - Read balances
 * - Transfer ERC-20 tokens
 * - Read blockchain data
 * 
 * Use these for simple payment flows, token transfers, and balance checking.
 * For custom contract logic, use `use-contract-interaction.ts` instead.
 */

/**
 * Send native CELO payments
 * 
 * @example
 * const { sendPayment, isPending, isSuccess, hash } = useCeloPayment();
 * await sendPayment('0x123...', '0.1'); // Send 0.1 CELO
 */
export function useCeloPayment() {
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendPayment = async (to: `0x${string}`, amountInCelo: string) => {
    return sendTransaction({
      to,
      value: parseEther(amountInCelo),
    });
  };

  return {
    sendPayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Get CELO balance for an address
 * 
 * @example
 * const { balance, formatted, isLoading } = useCeloBalance(address);
 * console.log(`Balance: ${formatted} CELO`);
 */
export function useCeloBalance(address?: `0x${string}`) {
  const { data, isLoading, refetch } = useBalance({
    address,
  });

  return {
    balance: data?.value,
    formatted: data?.formatted,
    symbol: data?.symbol,
    decimals: data?.decimals,
    isLoading,
    refetch,
  };
}

/**
 * Standard ERC-20 ABI (minimal subset for common operations)
 */
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

/**
 * Transfer ERC-20 tokens (like cUSD, cEUR, etc.)
 * 
 * @example
 * const { transferToken, isPending, hash } = useTokenTransfer();
 * await transferToken(
 *   '0xTokenAddress',
 *   '0xRecipient', 
 *   '10',
 *   6  // 6 decimals for cUSD
 * );
 */
export function useTokenTransfer() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transferToken = async (
    tokenAddress: `0x${string}`,
    to: `0x${string}`,
    amount: string,
    decimals: number = 18
  ) => {
    return writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to, parseUnits(amount, decimals)],
    });
  };

  return {
    transferToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Read ERC-20 token balance
 * 
 * @example
 * const { balance, formatted, isLoading } = useTokenBalance(
 *   CELO_TOKENS.sepolia.cUSD,
 *   userAddress,
 *   6  // cUSD has 6 decimals
 * );
 */
export function useTokenBalance(
  tokenAddress?: `0x${string}`,
  userAddress?: `0x${string}`,
  decimals: number = 18
) {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
  });

  const formatted = balance 
    ? (Number(balance as bigint) / Math.pow(10, decimals)).toFixed(4)
    : "0";

  return {
    balance: balance as bigint | undefined,
    formatted,
    isLoading,
    refetch,
  };
}

/**
 * Approve token spending (required before swaps/transfers via contracts)
 * 
 * @example
 * const { approve, isPending } = useTokenApproval();
 * // Approve 100 cUSD for spending by a contract
 * await approve(CELO_TOKENS.sepolia.cUSD, '0xSpenderAddress', '100', 6);
 */
export function useTokenApproval() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: string,
    decimals: number = 18
  ) => {
    return writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender, parseUnits(amount, decimals)],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Common token addresses on Celo networks
 * Use these constants for easy token integration
 */
export const CELO_TOKENS = {
  mainnet: {
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73' as `0x${string}`,
    cREAL: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787' as `0x${string}`,
  },
  alfajores: {
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as `0x${string}`,
    cEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F' as `0x${string}`,
  },
  sepolia: {
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    // Add more as discovered
  },
};

/**
 * Simple payment button example component
 * Copy this pattern for your tip/donation features
 */
export function useTipPayment(recipientAddress: `0x${string}`) {
  const { sendPayment, isPending, isSuccess, hash, error } = useCeloPayment();

  const sendTip = async (amountInCelo: string) => {
    return sendPayment(recipientAddress, amountInCelo);
  };

  return {
    sendTip,
    isPending,
    isSuccess,
    hash,
    error,
  };
}


