'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatUSD } from '@/lib/utils';
import type { ChainStats } from '@/types';

interface VolumeSlideProps {
  totalVolume: number;
  highestVolumeChain: ChainStats | null;
}

export function VolumeSlide({ totalVolume, highestVolumeChain }: VolumeSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.VOLUME]}>
      <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 -translate-y-4 md:-translate-y-6">
        <motion.p
          className="text-lg md:text-xl text-white/75 font-light tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          You bridged a total of
        </motion.p>

        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          <AnimatedCounter
            value={totalVolume}
            formatFn={(v) => formatUSD(v)}
            className="block text-[4.5rem] md:text-[6.5rem] lg:text-[8rem] font-semibold text-white tracking-[-0.04em] leading-[0.95] text-center"
            duration={2.5}
          />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-white/85 font-normal tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          in cross-chain volume
        </motion.p>

        {highestVolumeChain && highestVolumeChain.volumeUSD > 0 && (
          <motion.div
            className="mt-12 md:mt-14 p-6 md:p-8 lg:p-10 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-white/60 text-sm tracking-wide mb-2">
              Highest volume destination
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-white mb-1 tracking-tight">
              {highestVolumeChain.chainName}
            </p>
            <p className="text-white/70 text-base md:text-lg">
              {formatUSD(highestVolumeChain.volumeUSD)} bridged
            </p>
          </motion.div>
        )}
      </div>
    </SlideContainer>
  );
}
