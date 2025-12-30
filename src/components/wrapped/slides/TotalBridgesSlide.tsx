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
      <div className="space-y-10 md:space-y-12">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          In {year}, you made
        </motion.p>

        <motion.div
          className="py-10 md:py-12"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          <AnimatedCounter
            value={totalBridges}
            formatFn={formatNumber}
            className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-white tracking-tight leading-none"
            duration={2}
          />
        </motion.div>

        <motion.p
          className="text-3xl md:text-5xl text-white font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          cross-chain bridges
        </motion.p>

        <motion.p
          className="mt-14 md:mt-16 text-white/60 text-lg md:text-xl font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {totalBridges > 100
            ? "That's... a lot. Try Avail Nexus. You're a bridging powerhouse! "
            : totalBridges > 50
            ? 'Impressive bridging activity! Avail Nexus could heal you'
            : totalBridges > 10
            ? 'Nice bridging journey!\n You should try Avail Nexus'
            : 'Every bridge counts!'}
        </motion.p>
      </div>
    </SlideContainer>
  );
}
