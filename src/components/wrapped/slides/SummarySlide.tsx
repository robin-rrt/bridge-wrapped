'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatNumber, formatUSD, truncateAddress } from '@/lib/utils';
import type { BridgeWrappedStats } from '@/types';

interface SummarySlideProps {
  stats: BridgeWrappedStats;
}

export function SummarySlide({ stats }: SummarySlideProps) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Your {stats.year} Recap
        </h2>
        <p className="text-white/50 mb-8">
          {truncateAddress(stats.walletAddress, 6)}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
          variants={itemVariants}
        >
          <p className="text-white/60 text-sm">Total Bridges</p>
          <p className="text-2xl font-bold text-white">
            {formatNumber(stats.totalBridgingActions)}
          </p>
        </motion.div>

        <motion.div
          className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
          variants={itemVariants}
        >
          <p className="text-white/60 text-sm">Total Volume</p>
          <p className="text-2xl font-bold text-white">
            {formatUSD(stats.totalVolumeUSD)}
          </p>
        </motion.div>

        {stats.mostUsedSourceChain && (
          <motion.div
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
            variants={itemVariants}
          >
            <p className="text-white/60 text-sm">Top Source</p>
            <p className="text-xl font-bold text-white">
              {stats.mostUsedSourceChain.chainName}
            </p>
          </motion.div>
        )}

        {stats.mostUsedDestinationChain && (
          <motion.div
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
            variants={itemVariants}
          >
            <p className="text-white/60 text-sm">Top Destination</p>
            <p className="text-xl font-bold text-white">
              {stats.mostUsedDestinationChain.chainName}
            </p>
          </motion.div>
        )}

        {stats.mostBridgedToken && (
          <motion.div
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
            variants={itemVariants}
          >
            <p className="text-white/60 text-sm">Favorite Token</p>
            <p className="text-xl font-bold text-white">
              {stats.mostBridgedToken.symbol}
            </p>
          </motion.div>
        )}

        {stats.busiestDay && (
          <motion.div
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
            variants={itemVariants}
          >
            <p className="text-white/60 text-sm">Busiest Day</p>
            <p className="text-xl font-bold text-white">
              {stats.busiestDay.count} bridges
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-center px-4">
          <p className="text-white/50 text-xs uppercase tracking-wide">
            Across
          </p>
          <p className="text-white font-semibold">
            {stats.providerBreakdown.across.count} bridges
          </p>
        </div>
        <div className="text-center px-4">
          <p className="text-white/50 text-xs uppercase tracking-wide">Relay</p>
          <p className="text-white font-semibold">
            {stats.providerBreakdown.relay.count} bridges
          </p>
        </div>
        <div className="text-center px-4">
          <p className="text-white/50 text-xs uppercase tracking-wide">LiFi</p>
          <p className="text-white font-semibold">
            {stats.providerBreakdown.lifi.count} bridges
          </p>
        </div>
      </motion.div>
    </SlideContainer>
  );
}
