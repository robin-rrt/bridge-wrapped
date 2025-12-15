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
      <motion.p
        className="text-xl text-white/70 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        You bridged a total of
      </motion.p>

      <motion.div
        className="mb-6"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
      >
        <AnimatedCounter
          value={totalVolume}
          formatFn={(v) => formatUSD(v)}
          className="text-6xl md:text-7xl font-bold text-white"
          duration={2.5}
        />
      </motion.div>

      <motion.p
        className="text-2xl text-white/80 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        in cross-chain volume
      </motion.p>

      {highestVolumeChain && highestVolumeChain.volumeUSD > 0 && (
        <motion.div
          className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-white/70 text-sm mb-2">
            Highest volume destination
          </p>
          <p className="text-2xl font-bold text-white">
            {highestVolumeChain.chainName}
          </p>
          <p className="text-white/60">
            {formatUSD(highestVolumeChain.volumeUSD)} bridged
          </p>
        </motion.div>
      )}
    </SlideContainer>
  );
}
