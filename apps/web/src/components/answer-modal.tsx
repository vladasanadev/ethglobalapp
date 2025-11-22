"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, WOMANSPLAIN_QUESTIONS_ABI } from "@/lib/contracts";

type Question = {
  id: bigint;
  content: string;
  screenshot: string;
  timestamp: bigint;
};

type AnswerModalProps = {
  question: Question;
  onClose: () => void;
};

export function AnswerModal({ question, onClose }: AnswerModalProps) {
  const [answer, setAnswer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
        abi: WOMANSPLAIN_QUESTIONS_ABI,
        functionName: "answerQuestion",
        args: [question.id, answer, isAnonymous],
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  // Close modal on success
  if (isSuccess) {
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-lightTan border-4 border-yellow w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-yellow text-black p-6 border-b-4 border-black">
          <div className="flex items-center justify-between">
            <h3 className="font-alpina text-3xl font-thin tracking-tight">
              Answer <span className="italic">Question</span>
            </h3>
            <button
              onClick={onClose}
              className="font-inter text-2xl font-bold hover:text-darkPurple transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Original Question */}
          <div className="bg-white border-4 border-black p-6">
            <span className="font-inter text-xs font-bold uppercase tracking-widest text-brown block mb-3">
              ORIGINAL QUESTION
            </span>
            <p className="font-inter text-lg leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Answer Textarea */}
            <div>
              <label className="font-inter text-sm font-bold uppercase tracking-widest block mb-3">
                YOUR ANSWER
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your honest perspective..."
                rows={8}
                maxLength={2000}
                className="w-full px-6 py-4 bg-white text-black border-4 border-black focus:outline-none focus:border-yellow transition-colors duration-150 font-inter text-base"
              />
              <p className="font-inter text-xs text-brown mt-2">
                {answer.length} / 2000 characters
              </p>
            </div>

            {/* Anonymous Toggle */}
            <div className="bg-tan border-4 border-brown p-6">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-6 h-6 border-4 border-black cursor-pointer"
                />
                <div>
                  <div className="font-inter text-sm font-bold uppercase tracking-wide">
                    ANSWER ANONYMOUSLY
                  </div>
                  <div className="font-inter text-xs text-brown mt-1">
                    Your wallet address will be hidden from the public (but stored on-chain for verification)
                  </div>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isConfirming}
                className="
                  font-inter text-base font-bold uppercase tracking-wider
                  px-8 py-4 flex-1
                  bg-white text-black border-4 border-black
                  hover:bg-tan
                  transition-colors duration-150
                  disabled:opacity-50
                "
              >
                CANCEL
              </button>
              
              <button
                type="submit"
                disabled={isConfirming || !answer.trim()}
                className="
                  font-inter text-base font-bold uppercase tracking-wider
                  px-8 py-4 flex-1
                  bg-forestGreen text-white border-4 border-forestGreen
                  hover:bg-white hover:text-forestGreen
                  transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isConfirming ? "SUBMITTING..." : "SUBMIT ANSWER"}
              </button>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="bg-lime text-black border-4 border-black px-6 py-4">
                <p className="font-inter font-bold uppercase tracking-widest">
                  ✓ ANSWER SUBMITTED
                </p>
                <p className="font-inter text-sm mt-2">
                  You earned 10 validation points! Closing modal...
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


