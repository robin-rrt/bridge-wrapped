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
      <div className="space-y-10 text-center">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your busiest bridging day
        </motion.p>

       
          <p className="text-3xl md:text-5xl font-bold text-yellow-300 ">
            {formattedDate}
          </p>
           <br />
    

        <motion.div
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-white/70 text-lg md:text-xl mb-4">You bridged</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AnimatedCounter
              value={busiestDay.count}
              className="text-7xl md:text-8xl font-bold text-yellow-300"
            />
            <span className="text-4xl md:text-5xl text-yellow-300">times</span>
          </div>
          <motion.p
            className="text-white/70 text-lg md:text-xl mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Mostly to <span className="font-semibold text-white">{busiestDay.primaryDestination.chainName}</span> ({busiestDay.primaryDestination.count} bridges)
          </motion.p>
        </motion.div>
        

        <motion.div
          className="inline-block max-w-xl p-6 md:p-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          <p className="text-white text-lg md:text-xl mb-3 leading-relaxed">
            💡 You could've reduced multiple bridging by{' '}
            <span className="font-bold text-white text-2xl md:text-3xl">90%</span>
          </p>
          <p className="text-white/80 text-base md:text-lg mb-3">
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
          <p className="text-white/60 text-sm md:text-base">
            A bridgeless experience for seamless cross-chain transfers
          </p>
        </motion.div>
      </div>
    </SlideContainer>
  );
}
