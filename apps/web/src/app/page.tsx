"use client";

import { useState, useEffect } from "react";
import { useMiniApp } from "@/contexts/miniapp-context";
import { useAccount, useConnect } from "wagmi";
import { useProofOfWomanhoodRead } from "@/hooks/use-contract-interaction";
import { SubmitQuestionTab } from "@/components/tabs/submit-question";
import { RedFlagDetectionTab } from "@/components/tabs/red-flag-detection";
import { ProfileTab } from "@/components/tabs/profile";
import { Logo } from "@/components/logo";

type Tab = "submit" | "profile" | "redflags";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isMiniAppReady } = useMiniApp();
  const { address, isConnected, isConnecting, connector: activeConnector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [activeTab, setActiveTab] = useState<Tab>("submit");
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Check verification status and gender - only when address is available
  const { isVerified, gender, hasDisclosedGender, validationPoints, isLoading: isLoadingVerification} = 
    useProofOfWomanhoodRead(address || undefined);

  // Auto-redirect to submit tab when user connects
  useEffect(() => {
    if (!isConnected || !address || isLoadingVerification) return;
    
    // Default to submit tab when connected
    if (hasDisclosedGender && activeTab !== "submit" && activeTab !== "redflags" && activeTab !== "profile") {
      setActiveTab("submit");
    }
  }, [isConnected, address, hasDisclosedGender, isLoadingVerification, activeTab]);

  // Ensure client-side only rendering to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mark as initialized once SDK is ready
  useEffect(() => {
    if (!mounted) return;
    
    // Once the mini app SDK is ready and we have connectors, we're initialized
    if (isMiniAppReady && connectors.length > 0) {
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, isMiniAppReady, connectors.length]);


  // Clear error when successfully connected
  useEffect(() => {
    if (isConnected && connectionError) {
      setConnectionError(null);
    }
  }, [isConnected, connectionError]);

  // Handle connection with error handling
  const handleConnect = async (connector: typeof connectors[0]) => {
    try {
      setConnectionError(null);
      await connect({ connector });
    } catch (error: unknown) {
      let errorMessage = "Connection failed";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setConnectionError(errorMessage);
    }
  };


  // Show loading during mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="loading-container min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow text-sm uppercase tracking-wider font-medium">LOADING</p>
        </div>
      </div>
    );
  }

  // Show loading only during initial setup
  const showLoading = !isMiniAppReady || isInitializing;
  
  if (showLoading) {
    return (
      <div className="loading-container min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow text-sm uppercase tracking-wider font-medium">INITIALIZING</p>
        </div>
      </div>
    );
  }

  // Show wallet connection options if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Logo size="large" />
            <p className="text-yellow text-sm uppercase tracking-wider opacity-80 mt-4">
              Anonymous advice from verified women
            </p>
          </div>

          <div className="bg-white/5 border-3 border-yellow p-6">
            <h2 className="text-yellow text-xl font-bold mb-4 uppercase">Connect Your Wallet</h2>
            
            {connectionError && (
              <div className="bg-red-900/50 text-red-200 p-3 mb-4 text-sm border border-red-500">
                <p className="font-bold mb-1">Error:</p>
                <p>{connectionError}</p>
              </div>
            )}

            {connectors.length === 0 ? (
              <div className="text-white text-center py-8">
                <p className="mb-4">No wallet connectors available.</p>
                <p className="text-sm text-gray-400">
                  Please ensure you're accessing this app from Farcaster.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={isConnecting || isPending}
                    className="w-full bg-yellow text-black font-bold py-4 px-6 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span>{connector.name}</span>
                    {isConnecting && (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tab configuration
  const tabs: { id: Tab; label: string; requiresVerification: boolean; badge?: string }[] = [
    { id: "submit", label: "SUBMIT", requiresVerification: false },
    { id: "redflags", label: "RED FLAGS", requiresVerification: false, badge: "BETA" },
    { id: "profile", label: "PROFILE", requiresVerification: false },
  ];

  // Safety check - if no address, show error
  if (!address) {
    return (
      <div className="loading-container min-h-screen bg-black flex items-center justify-center fade-in">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-yellow text-3xl font-bold mb-4">CONNECTION ERROR</h2>
          <p className="text-white mb-6">
            Wallet appears connected but no address found. Please try reconnecting.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow text-black font-bold py-3 px-8 uppercase tracking-wider hover:bg-white transition-colors"
          >
            Reload App
          </button>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-gray-400 text-xs mt-4">
              Debug: isConnected={String(isConnected)}, address={address || "null"}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-lightTan fade-in">
      {/* Header with geometric logo */}
      <header className="bg-purple-950 text-yellow border-b-4 border-yellow py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
          <Logo size="medium" />
          <p className="text-xs uppercase tracking-widest mt-2 opacity-80">
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
                  relative
                  ${
                    activeTab === tab.id
                      ? "bg-yellow text-black"
                      : "bg-white text-black hover:bg-tan"
                  }
                `}
              >
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-forestGreen text-yellow text-[10px] font-bold border-2 border-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Wallet Connection Status Bar */}
      <div className="bg-forestGreen text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <div className="flex items-center gap-4">
              {isLoadingVerification ? (
                <span className="text-xs uppercase tracking-widest">
                  Checking status...
                </span>
              ) : isVerified ? (
                <span className="text-xs font-bold uppercase tracking-widest bg-yellow text-black px-3 py-1">
                  VERIFIED WOMAN
                </span>
              ) : (
                <span className="text-xs uppercase tracking-widest opacity-60">
                  Not verified
                </span>
              )}
              {validationPoints !== undefined && (
                <span className="text-xs uppercase tracking-widest">
                  {validationPoints.toString()} pts
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {activeTab === "submit" && <SubmitQuestionTab />}
        {activeTab === "redflags" && <RedFlagDetectionTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </main>
  );
}
