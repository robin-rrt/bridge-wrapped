'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SlideContainer } from './SlideContainer';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatNumber, formatUSD, truncateAddress } from '@/lib/utils';
import { classifyUser } from '@/lib/userClassification';
import type { BridgeWrappedStats } from '@/types';

interface SummarySlideProps {
  stats: BridgeWrappedStats;
}

export function SummarySlide({ stats }: SummarySlideProps) {
  const userClass = classifyUser(stats.transactions, stats.totalVolumeUSD);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.SUMMARY]}>
      <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Your {stats.year} Recap
          </h2>
          <p className="text-white/60 text-sm md:text-base">
            {truncateAddress(stats.walletAddress, 6)}
          </p>
        </motion.div>

        {/* User Class Card - Compact with breathing room */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-0.5 rounded-xl shadow-xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative w-12 h-12 flex-shrink-0 p-1.5">
                  <Image
                    src={userClass.image}
                    alt={userClass.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60">Your Class</p>
                  <h3 className="text-base md:text-lg font-bold text-white truncate">
                    {userClass.title}
                  </h3>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(userClass.rarity)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Table */}
        <motion.div
          className="w-full bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 divide-x divide-white/10">
            <motion.div className="p-4 text-center" variants={itemVariants}>
              <p className="text-white/60 text-xs mb-1">Total Bridges</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formatNumber(stats.totalBridgingActions)}
              </p>
            </motion.div>
            <motion.div className="p-4 text-center" variants={itemVariants}>
              <p className="text-white/60 text-xs mb-1">Total Volume</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formatUSD(stats.totalVolumeUSD)}
              </p>
            </motion.div>
          </div>

          <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
            {stats.mostUsedSourceChain && (
              <motion.div className="p-4 text-center" variants={itemVariants}>
                <p className="text-white/60 text-xs mb-1">Top Source</p>
                <p className="text-lg md:text-xl font-semibold text-white">
                  {stats.mostUsedSourceChain.chainName}
                </p>
              </motion.div>
            )}
            {stats.mostUsedDestinationChain && (
              <motion.div className="p-4 text-center" variants={itemVariants}>
                <p className="text-white/60 text-xs mb-1">Top Destination</p>
                <p className="text-lg md:text-xl font-semibold text-white">
                  {stats.mostUsedDestinationChain.chainName}
                </p>
              </motion.div>
            )}
          </div>

          <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
            {stats.mostBridgedToken && (
              <motion.div className="p-4 text-center" variants={itemVariants}>
                <p className="text-white/60 text-xs mb-1">Favorite Token</p>
                <p className="text-lg md:text-xl font-semibold text-white">
                  {stats.mostBridgedToken.symbol.length > 15
                    ? `${stats.mostBridgedToken.symbol.substring(0, 12)}...`
                    : stats.mostBridgedToken.symbol}
                </p>
              </motion.div>
            )}
            {stats.busiestDay && (
              <motion.div className="p-4 text-center" variants={itemVariants}>
                <p className="text-white/60 text-xs mb-1">Busiest Day</p>
                <p className="text-lg md:text-xl font-semibold text-white">
                  {stats.busiestDay.count} bridges
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bridge Providers Table */}
        <motion.div
          className="w-full bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div className="p-3 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">ACROSS</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {stats.providerBreakdown.across.count}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">RELAY</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {stats.providerBreakdown.relay.count}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">LIFI</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {stats.providerBreakdown.lifi.count}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </SlideContainer>
  );
}
