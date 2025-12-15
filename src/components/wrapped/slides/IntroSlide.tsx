'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';

interface IntroSlideProps {
  year: number;
}

export function IntroSlide({ year }: IntroSlideProps) {
  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.INTRO]}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-6"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Bridge
          <br />
          Wrapped
        </motion.h1>
        <motion.p
          className="text-2xl md:text-4xl text-white/80 font-light"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {year}
        </motion.p>
      </motion.div>

      <motion.p
        className="mt-12 text-white/60 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Let&apos;s see your bridging journey
      </motion.p>
    </SlideContainer>
  );
}
