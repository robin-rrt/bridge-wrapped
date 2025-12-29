'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SLIDE_GRADIENTS, SLIDE_TYPES } from '@/lib/constants';
import { formatUSD } from '@/lib/utils';
import type { TokenStats } from '@/types';

interface TopTokenSlideProps {
  token: TokenStats;
}

export function TopTokenSlide({ token }: TopTokenSlideProps) {
  const isLongToken = token.symbol.length > 20;
  const isMediumToken = token.symbol.length > 10;

  return (
    <SlideContainer gradient={SLIDE_GRADIENTS[SLIDE_TYPES.TOP_TOKEN]}>
      <div className="space-y-8">
        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your most bridged token
        </motion.p>

        <motion.div
          className="py-6 flex items-center justify-center"
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/40 overflow-hidden">
            {token.logo ? (
              <div className="relative w-20 h-20 md:w-24 md:h-24 p-3">
                <Image
                  src={token.logo}
                  alt={token.symbol}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-white">
                {token.symbol.substring(0, 4)}
              </span>
            )}
          </div>
        </motion.div>

        <motion.h2
          className={`font-bold text-white mb-6 break-all px-4 leading-tight ${
            isLongToken
              ? 'text-lg md:text-xl lg:text-2xl'
              : isMediumToken
              ? 'text-2xl md:text-4xl lg:text-5xl'
              : 'text-4xl md:text-6xl lg:text-7xl'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          {token.symbol}
        </motion.h2>

        <motion.div
          className="space-y-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center justify-center gap-3 text-white/80">
            <AnimatedCounter
              value={token.count}
              className="text-4xl md:text-5xl font-semibold text-white"
            />
            <span className="text-xl md:text-2xl">times bridged</span>
          </div>

          {token.totalVolumeUSD > 0 && (
            <p className="text-white/70 text-lg md:text-xl">
              {formatUSD(token.totalVolumeUSD)} total volume
            </p>
          )}
        </motion.div>

        <motion.p
          className="mt-8 text-white/60 text-base md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {token.percentage}% of all your bridges
        </motion.p>
      </div>
    </SlideContainer>
  );
}
