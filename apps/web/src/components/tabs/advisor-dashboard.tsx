"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, WOMANSPLAIN_QUESTIONS_ABI } from "@/lib/contracts";
import { AnswerModal } from "@/components/answer-modal";
import { RedFlagVoter } from "@/components/red-flag-voter";

type Question = {
  id: bigint;
  asker: string;
  content: string;
  screenshot: string;
  timestamp: bigint;
  hasAnswer: boolean;
  redFlagScore: bigint;
  totalVotes: bigint;
};

export function AdvisorDashboardTab() {
  const { address } = useAccount();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);

  // Fetch unanswered questions
  const { data: questions, refetch } = useReadContract({
    address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
    abi: WOMANSPLAIN_QUESTIONS_ABI,
    functionName: "getUnansweredQuestions",
    args: [50n], // Get up to 50 unanswered questions
  });

  const handleAnswer = (question: Question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const handleVoteRedFlag = (question: Question) => {
    setSelectedQuestion(question);
    setShowRedFlagModal(true);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="space-y-8">
        {/* Section Header */}
        <div className="border-b-4 border-black pb-6">
          <h2 className="font-alpina text-5xl md:text-7xl font-thin tracking-tight leading-none mb-4">
            Advisor <span className="italic">Dashboard</span>
          </h2>
          <p className="font-inter text-lg text-brown max-w-2xl">
            Review questions from the community and provide your honest perspective.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow text-black p-4 border-4 border-black">
            <div className="font-alpina text-3xl font-thin">
              {questions?.length || 0}
            </div>
            <div className="font-inter text-xs uppercase tracking-widest mt-1">
              UNANSWERED
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {!questions || questions.length === 0 ? (
            <div className="bg-tan text-brown border-4 border-brown px-8 py-12 text-center">
              <p className="font-inter text-lg uppercase tracking-widest">
                NO UNANSWERED QUESTIONS
              </p>
              <p className="font-inter text-sm mt-2">
                Check back soon for new questions from the community.
              </p>
            </div>
          ) : (
            questions.map((question: Question) => (
              <div
                key={question.id.toString()}
                className="bg-white border-4 border-black p-6 space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-inter text-xs font-bold uppercase tracking-widest text-brown">
                      QUESTION #{question.id.toString()}
                    </span>
                    <span className="font-inter text-xs text-brown ml-4">
                      {formatTimestamp(question.timestamp)}
                    </span>
                  </div>
                  
                  {/* Red Flag Indicator */}
                  {question.totalVotes > 0n && (
                    <div className={`
                      px-3 py-1 border-2
                      ${Number(question.redFlagScore) > 70 
                        ? 'bg-darkPurple text-pink border-darkPurple' 
                        : Number(question.redFlagScore) > 40
                        ? 'bg-orange text-black border-orange'
                        : 'bg-lime text-black border-lime'
                      }
                    `}>
                      <span className="font-inter text-xs font-bold uppercase tracking-widest">
                        🚩 {question.redFlagScore.toString()}%
                      </span>
                      <span className="font-inter text-xs ml-2">
                        ({question.totalVotes.toString()} votes)
                      </span>
                    </div>
                  )}
                </div>

                {/* Question Content */}
                <div className="py-4">
                  <p className="font-inter text-lg leading-relaxed">
                    {question.content}
                  </p>
                </div>

                {/* Screenshot if present */}
                {question.screenshot && (
                  <div className="border-2 border-brown p-2">
                    <p className="font-inter text-xs uppercase tracking-widest text-brown mb-2">
                      SCREENSHOT
                    </p>
                    <img 
                      src={question.screenshot} 
                      alt="Question screenshot" 
                      className="w-full max-w-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => handleAnswer(question)}
                    className="
                      font-inter text-sm font-bold uppercase tracking-wider
                      px-6 py-3
                      bg-black text-yellow border-4 border-black
                      hover:bg-yellow hover:text-black
                      transition-colors duration-150
                    "
                  >
                    ANSWER QUESTION
                  </button>
                  
                  <button
                    onClick={() => handleVoteRedFlag(question)}
                    className="
                      font-inter text-sm font-bold uppercase tracking-wider
                      px-6 py-3
                      bg-white text-darkPurple border-4 border-darkPurple
                      hover:bg-darkPurple hover:text-pink
                      transition-colors duration-150
                    "
                  >
                    🚩 VOTE RED FLAG
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showAnswerModal && selectedQuestion && (
        <AnswerModal
          question={selectedQuestion}
          onClose={() => {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
            refetch();
          }}
        />
      )}

      {showRedFlagModal && selectedQuestion && (
        <RedFlagVoter
          question={selectedQuestion}
          onClose={() => {
            setShowRedFlagModal(false);
            setSelectedQuestion(null);
            refetch();
          }}
        />
      )}
    </>
  );
}


