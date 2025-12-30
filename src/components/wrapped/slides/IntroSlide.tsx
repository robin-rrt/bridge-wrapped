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
        className="space-y-10 md:space-y-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-[10rem] font-bold text-white leading-[0.9] tracking-normal pt-5"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Bridge
          <br />
          <span className="inline-block mt-3">Wrapped</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl lg:text-6xl text-white/90 font-light tracking-wide mt-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <br/>
          {year}
          <br/>
        </motion.p>
      </motion.div>

      <motion.p
        className="mt-20 md:mt-24 text-white/70 text-lg md:text-xl font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Let&apos;s explore your bridging journey
      </motion.p>
    </SlideContainer>
  );
}
