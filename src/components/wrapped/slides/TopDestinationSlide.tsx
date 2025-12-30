'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <div className="space-y-6 md:space-y-8">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your favorite DESTINATION chain
        </motion.p>

        <motion.div
          className="py-1 md:py-2 flex items-center justify-center"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          {chain.logo ? (
            <div className="relative w-32 h-32 md:w-40 md:h-40 p-4">
              <Image
                src={chain.logo}
                alt={chain.chainName}
                fill
                className="object-contain drop-shadow-2xl"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold shadow-2xl"
              style={{ backgroundColor: getChainColor(chain.chainId) }}
            >
              <span className="text-white">
                {chain.chainName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>

        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {chain.chainName}
        </motion.h2>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <AnimatedCounter
            value={chain.count}
            className="text-3xl md:text-5xl font-semibold text-white"
          />
          <span className="text-2xl md:text-3xl">bridges received</span>
        </motion.div>

        <motion.p
          className="text-white/60 text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {chain.percentage}% of all your bridges went here
        </motion.p>
      </div>
    </SlideContainer>
  );
}
