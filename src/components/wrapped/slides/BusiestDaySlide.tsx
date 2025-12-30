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
      <div className="space-y-4 md:space-y-6 text-center">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your busiest bridging day
        </motion.p>

       
          <p className="text-3xl md:text-5xl font-bold text-white">
            {formattedDate}
          </p>
    
    

        <motion.div
          className="py-1 md:py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-white/70 text-base md:text-lg mb-2">You bridged</p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <AnimatedCounter
              value={busiestDay.count}
              className="text-5xl md:text-6xl font-bold text-white"
            />
            <span className="text-3xl md:text-4xl text-white/80">times</span>
          </div>
          <motion.p
            className="text-white/70 text-lg md:text-xl mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Mostly to <span className="font-semibold text-white">{busiestDay.primaryDestination.chainName}</span> ({busiestDay.primaryDestination.count} bridges)
          </motion.p>
        </motion.div>
        

        <motion.div
          className="inline-block max-w-xl p-3 md:p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          <p className="text-white text-base md:text-lg mb-2 leading-relaxed">
            💡 You could&apos;ve reduced multiple bridging by{' '}
            <span className="font-bold text-white text-xl md:text-2xl">90%</span>
          </p>
          <p className="text-white/80 text-sm md:text-base mb-2">
            if you just used{' '}
            <a
              href="https://availproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-blue-200 transition-colors underline decoration-white/60 hover:decoration-blue-200"
            >
              Avail Nexus
            </a>
          </p>
          <p className="text-white/60 text-xs md:text-sm">
            A bridgeless experience for seamless cross-chain transfers
          </p>
        </motion.div>
      </div>
    </SlideContainer>
  );
}
