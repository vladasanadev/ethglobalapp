"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, PROOF_OF_WOMANHOOD_ABI } from "@/lib/contracts";

type VerificationGateProps = {
  children: React.ReactNode;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
};

export function VerificationGate({ children, isVerified, setIsVerified }: VerificationGateProps) {
  const { address, isConnected } = useAccount();
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is verified
  const { data: verificationStatus, isLoading } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "isVerifiedWoman",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsVerified(!!verificationStatus);
      setIsChecking(false);
    }
  }, [verificationStatus, isLoading, setIsVerified]);

  const handleStartVerification = () => {
    // TODO: Integrate Self Protocol verification flow
    // For now, show instructions
    alert(
      "Self Protocol Verification:\n\n" +
      "1. Open Self Protocol app\n" +
      "2. Complete gender verification\n" +
      "3. Generate proof\n" +
      "4. Submit proof to contract\n\n" +
      "Full integration coming soon!"
    );
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow text-black border-4 border-black px-8 py-12 text-center">
        <h3 className="font-alpina text-4xl font-thin tracking-tight mb-4">
          Connect Your <span className="italic">Wallet</span>
        </h3>
        <p className="font-inter text-lg">
          Please connect your wallet to access the Advisor Dashboard.
        </p>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="bg-white border-4 border-black px-8 py-12 text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="font-inter text-sm uppercase tracking-widest">
          CHECKING VERIFICATION STATUS
        </p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="space-y-8">
        {/* Verification Required Block */}
        <div className="bg-darkPurple text-pink border-4 border-darkPurple px-8 py-12">
          <h3 className="font-alpina text-5xl md:text-6xl font-thin tracking-tight leading-none mb-4">
            Verification <span className="italic">Required</span>
          </h3>
          <p className="font-inter text-lg mb-8">
            To access the Advisor Dashboard and answer questions, you need to verify your identity as a woman using Self Protocol.
          </p>
          
          <button
            onClick={handleStartVerification}
            className="
              font-inter text-base font-bold uppercase tracking-wider
              px-12 py-6
              bg-pink text-darkPurple border-4 border-pink
              hover:bg-darkPurple hover:text-pink hover:border-pink
              transition-colors duration-150
            "
          >
            START VERIFICATION
          </button>
        </div>

        {/* How it Works */}
        <div className="bg-white border-4 border-black p-8">
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-6">
            HOW VERIFICATION WORKS
          </h4>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow text-black border-2 border-black flex items-center justify-center font-alpina text-2xl">
                1
              </div>
              <div>
                <h5 className="font-inter text-sm font-bold uppercase tracking-wide mb-2">
                  Self Protocol Verification
                </h5>
                <p className="font-inter text-sm text-brown">
                  Use Self Protocol to verify your gender identity. This uses zero-knowledge proofs to protect your privacy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-forestGreen text-white border-2 border-forestGreen flex items-center justify-center font-alpina text-2xl">
                2
              </div>
              <div>
                <h5 className="font-inter text-sm font-bold uppercase tracking-wide mb-2">
                  Submit Proof On-Chain
                </h5>
                <p className="font-inter text-sm text-brown">
                  Your verification proof is submitted to the smart contract on Celo Sepolia testnet.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-lime text-black border-2 border-lime flex items-center justify-center font-alpina text-2xl">
                3
              </div>
              <div>
                <h5 className="font-inter text-sm font-bold uppercase tracking-wide mb-2">
                  Start Advising
                </h5>
                <p className="font-inter text-sm text-brown">
                  Once verified, you can answer questions, vote on red flags, and earn badges!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-tan text-brown border-4 border-brown p-6">
          <p className="font-inter text-xs uppercase tracking-widest mb-2">
            🔒 PRIVACY PROTECTED
          </p>
          <p className="font-inter text-sm">
            Self Protocol uses zero-knowledge proofs. Your personal information is never stored on-chain or shared publicly.
          </p>
        </div>
      </div>
    );
  }

  // User is verified, show the gated content
  return <>{children}</>;
}


