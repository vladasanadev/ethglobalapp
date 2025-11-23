"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TransactionStatus } from "./transaction-status";
import { 
  useWomansplainQuestions, 
  useProofOfWomanhood,
  useProofOfWomanhoodRead,
  useBatchTransactions 
} from "@/hooks/use-contract-interaction";
import { WalletConnect } from "./wallet-connect";
import { encodeFunctionData } from "viem";
import { CONTRACTS, WOMANSPLAIN_QUESTIONS_ABI } from "@/lib/contracts";

/**
 * Example: Submit a question transaction
 */
export function SubmitQuestionExample() {
  const { isConnected } = useAccount();
  const [content, setContent] = useState("");
  const { submitQuestion, hash, isPending, isConfirming, isSuccess, error } =
    useWomansplainQuestions();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await submitQuestion(content, ""); // Empty screenshot for now
      setContent(""); // Clear on success
    } catch (err) {
      console.error("Failed to submit question:", err);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Submit a Question</h3>
      
      {!isConnected && (
        <div className="mb-4">
          <WalletConnect />
        </div>
      )}

      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's your question?"
          className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
          disabled={!isConnected || isPending}
        />

        <Button
          onClick={handleSubmit}
          disabled={!isConnected || !content.trim() || isPending}
          className="w-full"
        >
          {isPending ? "Submitting..." : "Submit Question"}
        </Button>

        <TransactionStatus
          hash={hash}
          isPending={isPending}
          isConfirming={isConfirming}
          isSuccess={isSuccess}
          error={error}
          successMessage="Question submitted successfully!"
          errorMessage="Failed to submit question"
        />
      </div>
    </Card>
  );
}

/**
 * Example: Answer question and vote red flag in a batch transaction
 * Demonstrates EIP-5792 batch transaction support
 */
export function BatchTransactionExample() {
  const { isConnected } = useAccount();
  const [questionId, setQuestionId] = useState("1");
  const [answer, setAnswer] = useState("");
  const [redFlagScore, setRedFlagScore] = useState("5");
  const { sendBatchCalls, isPending, error, hash } = useBatchTransactions();

  const handleBatchSubmit = async () => {
    if (!answer.trim() || !questionId) return;

    try {
      // Prepare both transaction calls
      const answerCall = {
        to: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
        data: encodeFunctionData({
          abi: WOMANSPLAIN_QUESTIONS_ABI,
          functionName: "answerQuestion",
          args: [BigInt(questionId), answer, false], // not anonymous
        }) as `0x${string}`,
      };

      const voteCall = {
        to: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
        data: encodeFunctionData({
          abi: WOMANSPLAIN_QUESTIONS_ABI,
          functionName: "voteRedFlag",
          args: [BigInt(questionId), BigInt(redFlagScore)],
        }) as `0x${string}`,
      };

      // Send both transactions in a single batch
      await sendBatchCalls([answerCall, voteCall]);
      
      // Clear form on success
      setAnswer("");
      setRedFlagScore("5");
    } catch (err) {
      console.error("Batch transaction failed:", err);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">
        Answer & Vote (Batch Transaction)
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Answer a question and vote on red flag score in a single confirmation
      </p>

      {!isConnected && (
        <div className="mb-4">
          <WalletConnect />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Question ID</label>
          <input
            type="number"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Provide your answer..."
            className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
            disabled={!isConnected || isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Red Flag Score (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={redFlagScore}
            onChange={(e) => setRedFlagScore(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isConnected || isPending}
          />
        </div>

        <Button
          onClick={handleBatchSubmit}
          disabled={!isConnected || !answer.trim() || isPending}
          className="w-full"
        >
          {isPending ? "Processing..." : "Submit Answer & Vote"}
        </Button>

        <TransactionStatus
          hash={hash as `0x${string}` | undefined}
          isPending={isPending}
          isSuccess={!!hash && !error}
          error={error}
          successMessage="Answer submitted and vote recorded!"
          errorMessage="Batch transaction failed"
        />
      </div>
    </Card>
  );
}

/**
 * Example: Display user verification status from contract
 */
export function VerificationStatusDisplay() {
  const { address, isConnected } = useAccount();
  const { isVerified, validationPoints, badges, isLoading } = 
    useProofOfWomanhoodRead(address);

  if (!isConnected) {
    return (
      <Card className="p-6">
        <WalletConnect />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Loading verification status...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Verification Status</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Verified
          </span>
          <span className={`font-semibold ${isVerified ? 'text-green-600' : 'text-gray-400'}`}>
            {isVerified ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Validation Points
          </span>
          <span className="font-semibold">
            {validationPoints?.toString() || '0'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Badges
          </span>
          <span className="font-semibold">
            {badges?.toString() || '0'}
          </span>
        </div>
      </div>
    </Card>
  );
}


