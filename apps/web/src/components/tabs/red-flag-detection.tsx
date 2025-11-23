"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export function RedFlagDetectionTab() {
  const { address, isConnected } = useAccount();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Mock data for demonstration
  const mockQuestions = [
    {
      id: "1",
      text: "He said he's not ready for a relationship but keeps texting me every night...",
      redFlags: 3,
      greenFlags: 1,
      votes: 42,
    },
    {
      id: "2", 
      text: "My partner gets angry when I hang out with friends and checks my phone...",
      redFlags: 28,
      greenFlags: 0,
      votes: 35,
    },
    {
      id: "3",
      text: "He canceled our date again but posted stories of him out with his friends...",
      redFlags: 15,
      greenFlags: 2,
      votes: 18,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <h2 className="font-alpina text-3xl sm:text-5xl md:text-7xl font-thin tracking-tight leading-none">
            Red Flag <span className="italic">Detection</span>
          </h2>
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-forestGreen text-yellow text-xs sm:text-sm font-inter font-bold uppercase tracking-wider border-3 sm:border-4 border-black">
            BETA
          </span>
        </div>
        <p className="font-inter text-sm sm:text-base md:text-lg text-brown max-w-2xl">
          Community-powered relationship reality checks. Vote on questions to identify red flags and help others see situations clearly.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow text-black border-3 sm:border-4 border-black p-4 sm:p-6">
        <h3 className="font-inter text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
          HOW IT WORKS
        </h3>
        <p className="font-inter text-xs sm:text-sm">
          Read questions from the community and vote whether you see 🚩 red flags or 💚 green flags. 
          Your votes help others make informed decisions about their relationships.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-brown">
          RECENT QUESTIONS
        </h3>

        {mockQuestions.map((question) => {
          const totalVotes = question.redFlags + question.greenFlags;
          const redPercentage = totalVotes > 0 ? (question.redFlags / totalVotes) * 100 : 0;
          const greenPercentage = totalVotes > 0 ? (question.greenFlags / totalVotes) * 100 : 0;

          return (
            <div 
              key={question.id} 
              className="border-3 sm:border-4 border-black bg-white hover:border-yellow active:border-yellow transition-colors cursor-pointer"
              onClick={() => setSelectedQuestion(question.id)}
            >
              {/* Question Text */}
              <div className="p-4 sm:p-6 border-b-3 sm:border-b-4 border-black">
                <p className="font-inter text-sm sm:text-base leading-relaxed">
                  {question.text}
                </p>
              </div>

              {/* Voting Bar */}
              <div className="flex h-3 overflow-hidden">
                <div 
                  className="bg-red-600"
                  style={{ width: `${redPercentage}%` }}
                />
                <div 
                  className="bg-green-600"
                  style={{ width: `${greenPercentage}%` }}
                />
              </div>

              {/* Stats & Actions */}
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between bg-lightTan">
                <div className="flex flex-wrap gap-3 sm:gap-6 font-inter text-xs sm:text-sm">
                  <span className="font-bold">
                    🚩 {question.redFlags}
                  </span>
                  <span className="font-bold">
                    💚 {question.greenFlags}
                  </span>
                  <span className="text-brown">
                    {question.votes} votes
                  </span>
                </div>

                {isConnected ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white font-inter font-bold text-[10px] sm:text-xs uppercase border-2 border-black hover:bg-red-700 active:bg-red-700 transition-colors touch-manipulation">
                      🚩 RED
                    </button>
                    <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white font-inter font-bold text-[10px] sm:text-xs uppercase border-2 border-black hover:bg-green-700 active:bg-green-700 transition-colors touch-manipulation">
                      💚 GREEN
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-brown font-inter italic">
                    Connect wallet to vote
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Features */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-12">
        <div className="bg-black text-yellow p-4 sm:p-6 border-3 sm:border-4 border-black">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
            COMING SOON
          </h3>
          <p className="font-inter text-xs sm:text-sm">
            🎯 AI-powered pattern detection<br/>
            📊 Detailed analytics dashboard<br/>
            🏆 Reputation system for voters
          </p>
        </div>
        
        <div className="bg-forestGreen text-yellow p-4 sm:p-6 border-3 sm:border-4 border-forestGreen">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
            BETA FEATURES
          </h3>
          <p className="font-inter text-xs sm:text-sm">
            We're actively testing this feature. Your feedback helps us improve the algorithm and user experience.
          </p>
        </div>
      </div>

      {/* Connection Prompt */}
      {!isConnected && (
        <div className="bg-yellow text-black border-3 sm:border-4 border-black p-4 sm:p-6 text-center">
          <p className="font-inter font-bold uppercase tracking-widest mb-2 text-sm sm:text-base">
            WALLET CONNECTION REQUIRED
          </p>
          <p className="font-inter text-xs sm:text-sm">
            Connect your wallet to vote on questions and help the community.
          </p>
        </div>
      )}
    </div>
  );
}

