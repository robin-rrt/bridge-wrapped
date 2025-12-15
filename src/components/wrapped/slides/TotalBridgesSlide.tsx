'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

interface TotalBridgesSlideProps {
  totalBridges: number;
  year: number;
}

export function TotalBridgesSlide({ totalBridges, year }: TotalBridgesSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.TOTAL_BRIDGES]}>
      <motion.p
        className="text-xl text-white/70 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        In {year}, you made
      </motion.p>

      <motion.div
        className="mb-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
      >
        <AnimatedCounter
          value={totalBridges}
          formatFn={formatNumber}
          className="text-8xl md:text-9xl font-bold text-white"
          duration={2}
        />
      </motion.div>

      <motion.p
        className="text-3xl md:text-4xl text-white/90 font-medium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        cross-chain bridges
      </motion.p>

      <motion.p
        className="mt-8 text-white/50 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {totalBridges > 100
          ? "You're a bridging powerhouse!"
          : totalBridges > 50
          ? 'Impressive bridging activity!'
          : totalBridges > 10
          ? 'Nice bridging journey!'
          : 'Every bridge counts!'}
      </motion.p>
    </SlideContainer>
  );
}
