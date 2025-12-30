'use client';

import { motion } from 'framer-motion';
import { SlideContainer } from './SlideContainer';

export function AvailNexusSlide() {
  return (
    <SlideContainer gradient="from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="space-y-4 md:space-y-6">
        <motion.div
          className="py-1 md:py-2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <div className="text-6xl md:text-7xl">🌉</div>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight px-4 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Transfer the same volume
          <br />
          <span className="text-white/70">Remove the need for a bridge</span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg lg:text-xl text-white/90 text-center leading-relaxed font-light px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Tokens are meant to move freely between networks.
        </motion.p>

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <a
            href="https://docs.availproject.org/nexus/introduction-to-nexus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 md:px-8 md:py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/50 hover:border-white/70 transition-all duration-300 group shadow-2xl"
          >
            <p className="text-base md:text-lg lg:text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
              Use Avail Nexus
            </p>
            <p className="text-xs md:text-sm text-white/90 px-px">
              for a <span className="font-semibold">bridgeless experience</span> in 2026
            </p>
          </a>
        </motion.div>

        <motion.p
          className="text-sm md:text-base text-white/60 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Avail Nexus is the fastest, and easiest way for your application to go crosschain 🌊
        </motion.p>
      </div>
    </SlideContainer>
  );
}
