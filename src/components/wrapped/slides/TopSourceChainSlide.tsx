'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { getChainColor } from '@/services/chains/chainInfo';
import type { ChainStats } from '@/types';

interface TopSourceChainSlideProps {
  chain: ChainStats;
}

export function TopSourceChainSlide({ chain }: TopSourceChainSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.TOP_SOURCE]}>
      <motion.p
        className="text-xl text-white/70 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your favorite chain to bridge FROM
      </motion.p>

      <motion.div
        className="mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
      >
        <div
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl"
          style={{ backgroundColor: getChainColor(chain.chainId) }}
        >
          {chain.chainName.substring(0, 2).toUpperCase()}
        </div>
      </motion.div>

      <motion.h2
        className="text-5xl md:text-6xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {chain.chainName}
      </motion.h2>

      <motion.div
        className="flex items-center justify-center gap-2 text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <AnimatedCounter
          value={chain.count}
          className="text-3xl font-semibold text-white"
        />
        <span className="text-2xl">bridges</span>
        <span className="text-white/50 ml-2">
          ({chain.percentage}% of total)
        </span>
      </motion.div>
    </SlideContainer>
  );
}
