'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatUSD } from '@/lib/utils';
import type { TokenStats } from '@/types';

interface TopTokenSlideProps {
  token: TokenStats;
}

export function TopTokenSlide({ token }: TopTokenSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.TOP_TOKEN]}>
      <motion.p
        className="text-xl text-white/70 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your most bridged token
      </motion.p>

      <motion.div
        className="mb-6"
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="w-28 h-28 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/30">
          <span className="text-4xl font-bold text-white">
            {token.symbol.substring(0, 4)}
          </span>
        </div>
      </motion.div>

      <motion.h2
        className="text-5xl md:text-6xl font-bold text-white mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        {token.symbol}
      </motion.h2>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center justify-center gap-2 text-white/80">
          <AnimatedCounter
            value={token.count}
            className="text-3xl font-semibold text-white"
          />
          <span className="text-xl">times bridged</span>
        </div>

        {token.totalVolumeUSD > 0 && (
          <p className="text-white/60">
            {formatUSD(token.totalVolumeUSD)} total volume
          </p>
        )}
      </motion.div>

      <motion.p
        className="mt-6 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {token.percentage}% of all bridges
      </motion.p>
    </SlideContainer>
  );
}
