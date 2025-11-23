"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, PROOF_OF_WOMANHOOD_ABI } from "@/lib/contracts";

type ProfileTabProps = {
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
};

export function ProfileTab({ isVerified, setIsVerified }: ProfileTabProps) {
  const { address, isConnected } = useAccount();

  // Read verification status
  const { data: verificationStatus } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "isVerifiedWoman",
    args: address ? [address] : undefined,
  });

  // Read validation points
  const { data: points } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "validationPoints",
    args: address ? [address] : undefined,
  });

  // Read badges
  const { data: badgeFlags } = useReadContract({
    address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
    abi: PROOF_OF_WOMANHOOD_ABI,
    functionName: "getUserBadges",
    args: address ? [address] : undefined,
  });

  // Badge definitions
  const BADGES = [
    { name: "VERIFIED", bit: 0, icon: "✓", color: "bg-yellow text-black border-yellow", description: "Completed verification" },
    { name: "ADVISOR", bit: 1, icon: "💬", color: "bg-forestGreen text-white border-forestGreen", description: "Answered 5 questions" },
    { name: "EXPERT", bit: 2, icon: "⭐", color: "bg-orange text-black border-orange", description: "Answered 25 questions" },
    { name: "LEGEND", bit: 3, icon: "👑", color: "bg-darkPurple text-pink border-darkPurple", description: "Answered 100 questions" },
  ];

  const hasBadge = (bit: number) => {
    if (!badgeFlags) return false;
    return (Number(badgeFlags) & (1 << bit)) !== 0;
  };

  const pointsValue = points ? Number(points) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="border-b-3 sm:border-b-4 border-black pb-4 sm:pb-6">
        <h2 className="font-alpina text-3xl sm:text-5xl md:text-7xl font-thin tracking-tight leading-none mb-3 sm:mb-4">
          Your <span className="italic">Profile</span>
        </h2>
        <p className="font-inter text-sm sm:text-base md:text-lg text-brown max-w-2xl">
          Track your contributions and earned badges.
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-yellow text-black border-4 border-black px-8 py-12 text-center">
          <p className="font-inter text-lg uppercase tracking-widest">
            WALLET NOT CONNECTED
          </p>
          <p className="font-inter text-sm mt-2">
            Connect your wallet to view your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid - Big color blocks */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Verification Status */}
            <div className={`
              p-8 border-4
              ${verificationStatus 
                ? 'bg-forestGreen text-white border-forestGreen' 
                : 'bg-white text-black border-black'
              }
            `}>
              <div className="font-inter text-xs uppercase tracking-widest mb-4">
                VERIFICATION STATUS
              </div>
              <div className="font-alpina text-6xl font-thin mb-2">
                {verificationStatus ? "✓" : "✗"}
              </div>
              <div className="font-inter text-lg uppercase tracking-wide">
                {verificationStatus ? "VERIFIED WOMAN" : "NOT VERIFIED"}
              </div>
              {!verificationStatus && (
                <p className="font-inter text-sm mt-4 opacity-80">
                  Get verified to access the Advisor Dashboard and earn badges.
                </p>
              )}
            </div>

            {/* Validation Points */}
            <div className="bg-yellow text-black p-8 border-4 border-yellow">
              <div className="font-inter text-xs uppercase tracking-widest mb-4">
                VALIDATION POINTS
              </div>
              <div className="font-alpina text-6xl font-thin mb-2">
                {pointsValue}
              </div>
              <div className="font-inter text-sm mt-4">
                Earn points by answering questions and voting on red flags.
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h3 className="font-alpina text-4xl font-thin tracking-tight mb-6">
              Badges <span className="italic">Earned</span>
            </h3>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {BADGES.map((badge) => {
                const earned = hasBadge(badge.bit);
                return (
                  <div
                    key={badge.name}
                    className={`
                      p-6 border-4 transition-all
                      ${earned 
                        ? badge.color 
                        : 'bg-tan text-brown border-brown opacity-50'
                      }
                    `}
                  >
                    <div className="text-4xl mb-3">
                      {earned ? badge.icon : "🔒"}
                    </div>
                    <div className="font-inter text-xs font-bold uppercase tracking-widest mb-2">
                      {badge.name}
                    </div>
                    <div className="font-inter text-xs">
                      {badge.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress to Next Badge */}
          {verificationStatus && (
            <div className="bg-black text-yellow p-6 border-4 border-black">
              <h4 className="font-inter text-xs font-bold uppercase tracking-widest mb-4">
                PROGRESS TO NEXT BADGE
              </h4>
              
              <div className="space-y-4">
                {!hasBadge(1) && pointsValue < 100 && (
                  <div>
                    <div className="flex justify-between font-inter text-sm mb-2">
                      <span>ADVISOR BADGE</span>
                      <span>{pointsValue} / 100 points</span>
                    </div>
                    <div className="w-full bg-darkPurple h-3 border-2 border-yellow">
                      <div 
                        className="bg-yellow h-full transition-all"
                        style={{ width: `${Math.min((pointsValue / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {hasBadge(1) && !hasBadge(2) && pointsValue < 300 && (
                  <div>
                    <div className="flex justify-between font-inter text-sm mb-2">
                      <span>EXPERT BADGE</span>
                      <span>{pointsValue} / 300 points</span>
                    </div>
                    <div className="w-full bg-darkPurple h-3 border-2 border-yellow">
                      <div 
                        className="bg-yellow h-full transition-all"
                        style={{ width: `${Math.min((pointsValue / 300) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {hasBadge(2) && !hasBadge(3) && pointsValue < 1050 && (
                  <div>
                    <div className="flex justify-between font-inter text-sm mb-2">
                      <span>LEGEND BADGE</span>
                      <span>{pointsValue} / 1050 points</span>
                    </div>
                    <div className="w-full bg-darkPurple h-3 border-2 border-yellow">
                      <div 
                        className="bg-yellow h-full transition-all"
                        style={{ width: `${Math.min((pointsValue / 1050) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {hasBadge(3) && (
                  <p className="font-inter text-sm">
                    🎉 You've earned all badges! You're a WOMANSPLAIN LEGEND!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Wallet Info */}
          <div className="bg-white border-4 border-black p-6">
            <div className="font-inter text-xs uppercase tracking-widest text-brown mb-3">
              CONNECTED WALLET
            </div>
            <div className="font-mono text-sm break-all">
              {address}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


