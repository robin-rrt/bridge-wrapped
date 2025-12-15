'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { BusiestDayStats } from '@/types';

interface BusiestDaySlideProps {
  busiestDay: BusiestDayStats;
}

export function BusiestDaySlide({ busiestDay }: BusiestDaySlideProps) {
  const formattedDate = formatDate(busiestDay.date);

  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.BUSIEST_DAY]}>
      <motion.p
        className="text-xl text-white/70 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your busiest bridging day
      </motion.p>

      <motion.div
        className="mb-6 p-6 bg-white/10 rounded-3xl backdrop-blur-sm inline-block"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
      >
        <p className="text-3xl md:text-4xl font-bold text-white">
          {formattedDate}
        </p>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-white/70 text-lg mb-2">You bridged</p>
        <div className="flex items-center justify-center gap-2">
          <AnimatedCounter
            value={busiestDay.count}
            className="text-6xl font-bold text-white"
          />
          <span className="text-3xl text-white/80">times</span>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm inline-block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
      >
        <p className="text-white/70 text-sm mb-1">Mostly to</p>
        <p className="text-xl font-semibold text-white">
          {busiestDay.primaryDestination.chainName}
        </p>
        <p className="text-white/50 text-sm">
          {busiestDay.primaryDestination.count} bridges
        </p>
      </motion.div>
    </SlideContainer>
  );
}
