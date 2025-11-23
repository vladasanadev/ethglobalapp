"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, WOMANSPLAIN_QUESTIONS_ABI } from "@/lib/contracts";
import { ImageUpload } from "@/components/image-upload";

export function SubmitQuestionTab() {
  const { address, isConnected } = useAccount();
  const [question, setQuestion] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      setIsSubmitting(true);
      
      writeContract({
        address: CONTRACTS.WOMANSPLAIN_QUESTIONS.address,
        abi: WOMANSPLAIN_QUESTIONS_ABI,
        functionName: "submitQuestion",
        args: [question, screenshot],
      });
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form on success
  if (isSuccess) {
    setTimeout(() => {
      setQuestion("");
      setScreenshot("");
      setScreenshotFile(null);
    }, 2000);
  }

  const handleImageSelect = (file: File, preview: string) => {
    setScreenshotFile(file);
    // Store base64 preview as the screenshot value
    // In production, you'd upload to IPFS and store the hash
    setScreenshot(preview);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="font-alpina text-3xl sm:text-5xl md:text-7xl font-thin tracking-tight leading-none mb-3 sm:mb-4">
          Ask the <span className="italic">Community</span>
        </h2>
        <p className="font-inter text-sm sm:text-base md:text-lg text-brown max-w-2xl">
          Submit your relationship question anonymously. Verified women in our community will provide honest, unfiltered advice.
        </p>
      </div>

      {/* Form - Big color blocks, sharp edges */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Question Input */}
        <div>
          <label className="font-inter text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2 sm:mb-3">
            YOUR QUESTION
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tell us what's going on..."
            rows={6}
            maxLength={1000}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-black border-3 sm:border-4 border-black focus:outline-none focus:border-yellow transition-colors duration-150 font-inter text-sm sm:text-base"
          />
          <p className="font-inter text-xs text-brown mt-2">
            {question.length} / 1000 characters
          </p>
        </div>

        {/* Screenshot Upload with Drag & Drop */}
        <div>
          <ImageUpload
            onImageSelect={handleImageSelect}
            maxSizeMB={5}
            label="SCREENSHOT (OPTIONAL)"
          />
          <p className="font-inter text-xs text-brown mt-2">
            Upload a screenshot to provide context. Drag & drop or click to select. Max 5MB.
          </p>
        </div>

        {/* Submit Button - Bold color inversion */}
        <button
          type="submit"
          disabled={isSubmitting || isConfirming || !isConnected}
          className={`
            font-inter text-base font-bold uppercase tracking-wider
            px-12 py-6 w-full
            border-4 transition-colors duration-150
            ${
              isSubmitting || isConfirming
                ? "bg-tan text-brown border-brown cursor-wait"
                : "bg-black text-yellow border-black hover:bg-yellow hover:text-black cursor-pointer"
            }
            ${!isConnected && "opacity-50 cursor-not-allowed"}
          `}
        >
          {isConfirming ? "CONFIRMING..." : isSubmitting ? "SUBMITTING..." : "SUBMIT QUESTION"}
        </button>

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-lime text-black border-4 border-black px-6 py-4">
            <p className="font-inter font-bold uppercase tracking-widest">
              ✓ QUESTION SUBMITTED
            </p>
            <p className="font-inter text-sm mt-2">
              Your question is now visible to our advisors. Check back soon for answers!
            </p>
          </div>
        )}

        {/* Connection Required Message */}
        {!isConnected && (
          <div className="bg-yellow text-black border-4 border-black px-6 py-4">
            <p className="font-inter font-bold uppercase tracking-widest">
              WALLET CONNECTION REQUIRED
            </p>
            <p className="font-inter text-sm mt-2">
              Please connect your wallet to submit a question.
            </p>
          </div>
        )}
      </form>

      {/* Info Block - Asymmetric layout */}
      <div className="grid md:grid-cols-3 gap-4 mt-12">
        <div className="bg-black text-yellow p-6 border-4 border-black">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
            ANONYMOUS
          </h3>
          <p className="font-inter text-sm">
            Your identity is protected. Questions are submitted anonymously.
          </p>
        </div>
        
        <div className="bg-forestGreen text-white p-6 border-4 border-forestGreen">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
            VERIFIED ADVISORS
          </h3>
          <p className="font-inter text-sm">
            All advisors are verified women who provide honest perspectives.
          </p>
        </div>
        
        <div className="bg-yellow text-black p-6 border-4 border-yellow">
          <h3 className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
            RED FLAG DETECTION
          </h3>
          <p className="font-inter text-sm">
            Community votes on red flags to help you make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
}


