'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <div className="space-y-10 md:space-y-12">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your favorite chain to bridge FROM
        </motion.p>

        <motion.div
          className="py-10 md:py-12 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
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
          className="text-5xl md:text-7xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {chain.chainName}
        </motion.h2>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 md:gap-5 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <AnimatedCounter
            value={chain.count}
            className="text-5xl md:text-6xl font-semibold text-white"
          />
          <span className="text-2xl md:text-3xl">bridges</span>
        </motion.div>

        <motion.p
          className="text-white/60 text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {chain.percentage}% of your total bridges
        </motion.p>
      </div>
    </SlideContainer>
  );
}
