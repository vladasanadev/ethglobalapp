"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, WOMANSPLAIN_QUESTIONS_ABI } from "@/lib/contracts";

type Question = {
  id: bigint;
  content: string;
  redFlagScore: bigint;
  totalVotes: bigint;
};

type RedFlagVoterProps = {
  question: Question;
  onClose: () => void;
};

export function RedFlagVoter({ question, onClose }: RedFlagVoterProps) {
  const [score, setScore] = useState(50);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      writeContract({
        address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
        abi: WOMANSPLAIN_QUESTIONS_ABI,
        functionName: "voteRedFlag",
        args: [question.id, BigInt(score)],
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please try again.");
    }
  };

  // Close modal on success
  if (isSuccess) {
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  // Red flag interpretation based on score
  const getRedFlagLevel = (s: number) => {
    if (s >= 80) return { label: "SERIOUS RED FLAG", color: "darkPurple", emoji: "🚩🚩🚩" };
    if (s >= 60) return { label: "MAJOR RED FLAG", color: "darkPurple", emoji: "🚩🚩" };
    if (s >= 40) return { label: "RED FLAG", color: "orange", emoji: "🚩" };
    if (s >= 20) return { label: "MINOR CONCERN", color: "yellow", emoji: "⚠️" };
    return { label: "GREEN FLAG", color: "lime", emoji: "✓" };
  };

  const currentLevel = getRedFlagLevel(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-lightTan border-4 border-darkPurple w-full max-w-2xl">
        {/* Modal Header */}
        <div className="bg-darkPurple text-pink p-6 border-b-4 border-black">
          <div className="flex items-center justify-between">
            <h3 className="font-alpina text-3xl font-thin tracking-tight">
              Red Flag <span className="italic">Rating</span>
            </h3>
            <button
              onClick={onClose}
              className="font-inter text-2xl font-bold hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Question */}
          <div className="bg-white border-4 border-black p-6">
            <span className="font-inter text-xs font-bold uppercase tracking-widest text-brown block mb-3">
              QUESTION
            </span>
            <p className="font-inter leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Current Community Rating */}
          {question.totalVotes > 0n && (
            <div className="bg-tan border-4 border-brown p-4">
              <div className="font-inter text-xs uppercase tracking-widest text-brown mb-2">
                CURRENT COMMUNITY RATING
              </div>
              <div className="flex items-center gap-3">
                <div className="font-alpina text-3xl font-thin">
                  {question.redFlagScore.toString()}%
                </div>
                <div className="font-inter text-sm text-brown">
                  based on {question.totalVotes.toString()} votes
                </div>
              </div>
            </div>
          )}

          {/* Vote Form */}
          <form onSubmit={handleVote} className="space-y-6">
            {/* Slider */}
            <div>
              <label className="font-inter text-sm font-bold uppercase tracking-widest block mb-4">
                YOUR RED FLAG RATING
              </label>
              
              {/* Score Display - Big and Bold */}
              <div className={`
                bg-${currentLevel.color} 
                ${currentLevel.color === 'lime' ? 'text-black' : currentLevel.color === 'yellow' ? 'text-black' : 'text-white'}
                border-4 border-black p-6 mb-4 text-center
              `}>
                <div className="text-4xl mb-2">{currentLevel.emoji}</div>
                <div className="font-alpina text-5xl font-thin mb-2">
                  {score}%
                </div>
                <div className="font-inter text-sm font-bold uppercase tracking-widest">
                  {currentLevel.label}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full h-3 bg-tan border-4 border-black appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #B2EBA1 0%, 
                    #FCFF52 25%, 
                    #F29E5F 50%, 
                    #1A0329 100%)`
                }}
              />
              
              {/* Scale Labels */}
              <div className="flex justify-between font-inter text-xs uppercase tracking-wider mt-2">
                <span>0% GREEN</span>
                <span>100% RED</span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white border-4 border-black p-6">
              <div className="font-inter text-xs font-bold uppercase tracking-widest mb-3">
                RATING GUIDELINES
              </div>
              <div className="space-y-2 font-inter text-sm text-brown">
                <div><strong>0-20%:</strong> Green flag - healthy behavior</div>
                <div><strong>20-40%:</strong> Minor concerns worth discussing</div>
                <div><strong>40-60%:</strong> Red flag - problematic behavior</div>
                <div><strong>60-80%:</strong> Major red flag - concerning pattern</div>
                <div><strong>80-100%:</strong> Serious red flag - potentially dangerous</div>
              </div>
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
                disabled={isConfirming}
                className="
                  font-inter text-base font-bold uppercase tracking-wider
                  px-8 py-4 flex-1
                  bg-darkPurple text-pink border-4 border-darkPurple
                  hover:bg-pink hover:text-darkPurple
                  transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isConfirming ? "SUBMITTING..." : "SUBMIT VOTE"}
              </button>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="bg-lime text-black border-4 border-black px-6 py-4">
                <p className="font-inter font-bold uppercase tracking-widest">
                  ✓ VOTE SUBMITTED
                </p>
                <p className="font-inter text-sm mt-2">
                  You earned 2 validation points! Closing modal...
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


