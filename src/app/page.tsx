'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WrappedContainer, StatsSummary } from '@/components/wrapped';
import { useBridgeStatsQuery } from '@/hooks/useBridgeStats';
import { WRAPPED_YEAR } from '@/lib/constants';

type ViewMode = 'landing' | 'loading' | 'wrapped' | 'summary' | 'no-data';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [manualViewMode, setManualViewMode] = useState<ViewMode | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [queryAddress, setQueryAddress] = useState<string | undefined>();

  const { data: stats, isLoading, error } = useBridgeStatsQuery(
    queryAddress,
    WRAPPED_YEAR
  );

  // Derive view mode from state
  const viewMode = useMemo((): ViewMode => {
    // If manually set (for summary/wrapped toggle), use that
    if (manualViewMode === 'summary' || manualViewMode === 'wrapped') {
      return manualViewMode;
    }

    // If not connected and no query address, show landing
    if (!queryAddress) {
      return 'landing';
    }

    // If loading, show loading
    if (isLoading) {
      return 'loading';
    }

    // If we have stats
    if (stats) {
      if (stats.totalBridgingActions === 0) {
        return 'no-data';
      }
      // Default to wrapped view when we have data
      return manualViewMode || 'wrapped';
    }

    // If error, show landing
    if (error) {
      return 'landing';
    }

    return 'landing';
  }, [queryAddress, isLoading, stats, error, manualViewMode]);

  const handleGetWrapped = useCallback(() => {
    if (address) {
      setQueryAddress(address);
      setManualViewMode(null);
    }
  }, [address]);

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (manualAddress && /^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setQueryAddress(manualAddress);
      setManualViewMode(null);
    }
  }, [manualAddress]);

  const handleViewSummary = useCallback(() => {
    setManualViewMode('summary');
  }, []);

  const handleViewWrapped = useCallback(() => {
    setManualViewMode('wrapped');
  }, []);

  const handleReset = useCallback(() => {
    setQueryAddress(undefined);
    setManualAddress('');
    setManualViewMode(null);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {/* Landing View */}
        {viewMode === 'landing' && (
          <motion.div
            key="landing"
            className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 lg:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header with wallet connect */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
              <ConnectButton />
            </div>

            {/* Main content */}
            <motion.div
              className="text-center max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-8 md:mb-10">
                <span className="text-white">
                  Bridge
                </span>
                <br />
                <span className="text-white/60">Wrapped</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-5 md:mb-6">
                Discover your cross-chain bridging journey in {WRAPPED_YEAR}
              </p>

              <p className="text-white/50 mb-4 md:mb-5">
                Aggregating data from Across, Relay & LiFi
              </p>

              {/* Connected state - show Get Wrapped button */}
              {isConnected && address ? (
                <motion.button
                  onClick={handleGetWrapped}
                  className="px-8 py-4 bg-white text-black text-xl font-semibold rounded-2xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Your Wrapped
                </motion.button>
              ) : (
                <div className="space-y-6">
                  <p className="text-white/60">
                    Connect your wallet or enter an address
                  </p>

                  <ConnectButton />

                  <div className="flex items-center gap-4 text-white/40">
                    <div className="flex-1 h-px bg-white/20" />
                    <span>or</span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>

                  {/* Manual address input */}
                  <form
                    onSubmit={handleManualSubmit}
                    className="flex flex-col sm:flex-row gap-4 md:gap-5 max-w-md mx-auto"
                  >
                    <input
                      type="text"
                      placeholder="0x..."
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!/^0x[a-fA-F0-9]{40}$/.test(manualAddress)}
                      className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Look up
                    </button>
                  </form>
                </div>
              )}

              {error && (
                <motion.p
                  className="mt-6 text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error.message || 'Failed to fetch data. Please try again.'}
                </motion.p>
              )}
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-6 text-center">
              <p className="text-white/30 text-sm">
                Built with data from Across, Relay & LiFi protocols
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading View */}
        {viewMode === 'loading' && (
          <motion.div
            key="loading"
            className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 lg:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="lg" text="Fetching your bridging history..." />
            <motion.p
              className="mt-8 text-white/50 text-center max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Querying Across, Relay, and LiFi for your transactions...
            </motion.p>
          </motion.div>
        )}

        {/* No Data View */}
        {viewMode === 'no-data' && (
          <motion.div
            key="no-data"
            className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 lg:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-6xl mb-6">🌉</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No Bridges Found
              </h2>
              <p className="text-white/60 mb-8">
                We couldn&apos;t find any bridging activity for this wallet in{' '}
                {WRAPPED_YEAR}. Try a different address or start bridging!
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
              >
                Try Another Address
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Wrapped Experience */}
        {viewMode === 'wrapped' && stats && (
          <motion.div
            key="wrapped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WrappedContainer stats={stats} onComplete={handleViewSummary} />
          </motion.div>
        )}

        {/* Summary View */}
        {viewMode === 'summary' && stats && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 flex gap-3 md:gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
              >
                New Search
              </button>
              <ConnectButton />
            </div>
            <StatsSummary stats={stats} onViewWrapped={handleViewWrapped} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
