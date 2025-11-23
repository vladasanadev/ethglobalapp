"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { useState } from "react";
import { 
  CONTRACTS, 
  PROOF_OF_WOMANHOOD_ABI, 
  WOMANSPLAIN_QUESTIONS_ABI,
  CELO_SEPOLIA_CHAIN_ID 
} from "@/lib/contracts";

/**
 * Hook for interacting with the ProofOfWomanhood contract
 */
export function useProofOfWomanhood() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const verifySelfProof = async (proofPayload: `0x${string}`, userContextData: `0x${string}`) => {
    return writeContract({
      address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
      abi: PROOF_OF_WOMANHOOD_ABI,
      functionName: "verifySelfProof",
      args: [proofPayload, userContextData],
      chainId: CELO_SEPOLIA_CHAIN_ID,
    });
  };

  return {
    verifySelfProof,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for reading ProofOfWomanhood contract data
 */
export function useProofOfWomanhoodRead(userAddress?: `0x${string}`) {
  const { data: isVerified, isLoading: isLoadingVerified } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "isVerifiedWoman",
    args: userAddress ? [userAddress] : undefined,
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  const { data: gender, isLoading: isLoadingGender } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "getUserGender",
    args: userAddress ? [userAddress] : undefined,
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  const { data: hasDisclosed, isLoading: isLoadingDisclosed } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "hasDisclosedGender",
    args: userAddress ? [userAddress] : undefined,
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  const { data: validationPoints, isLoading: isLoadingPoints } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "validationPoints",
    args: userAddress ? [userAddress] : undefined,
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  const { data: badges, isLoading: isLoadingBadges } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "getUserBadges",
    args: userAddress ? [userAddress] : undefined,
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  return {
    isVerified: isVerified as boolean | undefined,
    gender: gender as string | undefined,
    hasDisclosedGender: hasDisclosed as boolean | undefined,
    validationPoints: validationPoints as bigint | undefined,
    badges: badges as bigint | undefined,
    isLoading: isLoadingVerified || isLoadingGender || isLoadingDisclosed || isLoadingPoints || isLoadingBadges,
  };
}

/**
 * Hook for interacting with the WomansplainQuestions contract
 */
export function useWomansplainQuestions() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitQuestion = async (content: string, screenshot: string) => {
    return writeContract({
      address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
      abi: WOMANSPLAIN_QUESTIONS_ABI,
      functionName: "submitQuestion",
      args: [content, screenshot],
      chainId: CELO_SEPOLIA_CHAIN_ID,
    });
  };

  const answerQuestion = async (
    questionId: bigint,
    content: string,
    isAnonymous: boolean
  ) => {
    return writeContract({
      address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
      abi: WOMANSPLAIN_QUESTIONS_ABI,
      functionName: "answerQuestion",
      args: [questionId, content, isAnonymous],
      chainId: CELO_SEPOLIA_CHAIN_ID,
    });
  };

  const voteRedFlag = async (questionId: bigint, score: bigint) => {
    return writeContract({
      address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
      abi: WOMANSPLAIN_QUESTIONS_ABI,
      functionName: "voteRedFlag",
      args: [questionId, score],
      chainId: CELO_SEPOLIA_CHAIN_ID,
    });
  };

  return {
    submitQuestion,
    answerQuestion,
    voteRedFlag,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for reading WomansplainQuestions contract data
 */
export function useWomansplainQuestionsRead() {
  const { data: unansweredQuestions, isLoading: isLoadingQuestions } = useReadContract({
    address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
    abi: WOMANSPLAIN_QUESTIONS_ABI,
    functionName: "getUnansweredQuestions",
    args: [10n], // Get 10 unanswered questions
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  const { data: questionCount, isLoading: isLoadingCount } = useReadContract({
    address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
    abi: WOMANSPLAIN_QUESTIONS_ABI,
    functionName: "questionCount",
    chainId: CELO_SEPOLIA_CHAIN_ID,
  });

  return {
    unansweredQuestions,
    questionCount: questionCount as bigint | undefined,
    isLoading: isLoadingQuestions || isLoadingCount,
  };
}

/**
 * Hook for batch transactions (EIP-5792)
 * Allows multiple transactions to be confirmed in a single user action
 * https://miniapps.farcaster.xyz/docs/guides/wallets#batch-transactions
 */
export function useBatchTransactions() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  const sendBatchCalls = async (calls: Array<{ to: `0x${string}`; data: `0x${string}`; value?: bigint }>) => {
    setIsPending(true);
    setError(null);
    
    try {
      // @ts-ignore - EIP-5792 support
      const ethereum = (window as any).ethereum;
      if (typeof ethereum?.request === 'function') {
        const result = await ethereum.request({
          method: 'wallet_sendCalls',
          params: [{
            version: '1.0',
            chainId: `0x${CELO_SEPOLIA_CHAIN_ID.toString(16)}`,
            from: (await ethereum.request({ method: 'eth_accounts' }))[0],
            calls: calls.map(call => ({
              to: call.to,
              data: call.data,
              value: call.value ? `0x${call.value.toString(16)}` : undefined,
            })),
          }],
        });
        setHash(result);
        return result;
      } else {
        throw new Error('Batch transactions not supported by this wallet');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    sendBatchCalls,
    isPending,
    error,
    hash,
  };
}


