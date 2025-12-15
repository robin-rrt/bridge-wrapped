'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { getChainColor } from '@/services/chains/chainInfo';
import type { ChainStats } from '@/types';

interface TopDestinationSlideProps {
  chain: ChainStats;
}

export function TopDestinationSlide({ chain }: TopDestinationSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.TOP_DESTINATION]}>
      <motion.p
        className="text-xl text-white/70 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your favorite DESTINATION chain
      </motion.p>

      <motion.div
        className="mb-6"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
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
        <span className="text-2xl">bridges received</span>
      </motion.div>

      <motion.p
        className="mt-6 text-white/50 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {chain.percentage}% of all your bridges went here
      </motion.p>
    </SlideContainer>
  );
}
