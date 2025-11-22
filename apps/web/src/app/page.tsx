"use client";

import { useState } from "react";
import { useMiniApp } from "@/contexts/miniapp-context";
import { useAccount } from "wagmi";

type Tab = "submit" | "advisor" | "profile";

export default function Home() {
  const { isMiniAppReady } = useMiniApp();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("submit");
  const [isVerified, setIsVerified] = useState(false);

  if (!isMiniAppReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-yellow text-sm uppercase">LOADING</p>
        </div>
      </div>
    );
  }

  // Tab configuration
  const tabs: { id: Tab; label: string; requiresVerification: boolean }[] = [
    { id: "submit", label: "SUBMIT QUESTION", requiresVerification: false },
    { id: "advisor", label: "ADVISOR DASHBOARD", requiresVerification: true },
    { id: "profile", label: "PROFILE", requiresVerification: false },
  ];

  return (
    <main className="min-h-screen bg-lightTan">
      {/* Header with bold typography */}
      <header className="bg-black text-yellow border-b-8 border-yellow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-6xl font-thin tracking-tight leading-none">
            WOMANSPLAIN
          </h1>
          <p className="text-sm uppercase tracking-widest mt-2 opacity-80">
            Anonymous advice from verified women
          </p>
        </div>
      </header>

      {/* Tab Navigation - Bold color blocks */}
      <nav className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  text-xs md:text-sm font-bold uppercase tracking-wider
                  px-4 md:px-8 py-4 md:py-6
                  border-r-4 border-black last:border-r-0
                  transition-colors duration-150
                  ${
                    activeTab === tab.id
                      ? "bg-yellow text-black"
                      : "bg-white text-black hover:bg-tan"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Wallet Connection Status Bar */}
      {isConnected && address && (
        <div className="bg-forestGreen text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {isVerified && (
                <span className="text-xs font-bold uppercase tracking-widest bg-yellow text-black px-3 py-1">
                  ✓ VERIFIED WOMAN
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border-4 border-black p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to WOMANSPLAIN</h2>
          <p className="text-lg mb-4">Current Tab: {activeTab}</p>
          <p className="text-sm">Status: {isConnected ? 'Connected' : 'Not Connected'}</p>
          {isConnected && <p className="text-xs mt-2">{address}</p>}
        </div>
      </div>
    </main>
  );
}
