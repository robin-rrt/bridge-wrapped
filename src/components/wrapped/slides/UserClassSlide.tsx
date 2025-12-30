'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SlideContainer } from './SlideContainer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { formatNumber, formatUSD } from '@/lib/utils';
import type { UserClassInfo } from '@/lib/userClassification';

interface UserClassSlideProps {
  userClass: UserClassInfo;
  totalBridges: number;
  totalVolumeUSD: number;
  avgTransactionVolume: number;
}

export function UserClassSlide({
  userClass,
  totalBridges,
  totalVolumeUSD,
  avgTransactionVolume,
}: UserClassSlideProps) {
  return (
    <SlideContainer gradient="from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="flex flex-col items-center space-y-2 md:space-y-3">
        <motion.p
          className="text-lg md:text-xl text-white/80 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Cross-chain Class
        </motion.p>

        {/* Pokemon Card Style Container */}
        <motion.div
          className="relative w-full max-w-[300px] md:max-w-[320px]"
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          {/* Card Background with gradient border */}
          <div className="relative bg-gradient-to-br from-white/40 via-white/20 to-white/40 p-0.5 rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 md:px-5 md:py-2.5 border-b border-white/10">
                <motion.h2
                  className="text-base md:text-lg font-bold text-white text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {userClass.title}
                </motion.h2>
              </div>

              {/* Card Image */}
              <motion.div
                className="relative w-full h-44 md:h-48 bg-gradient-to-br from-white/5 to-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={userClass.image}
                    alt={userClass.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </motion.div>

              {/* Card Stats */}
              <motion.div
                className="px-4 py-2.5 md:px-5 md:py-3 space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                {/* Stat bars */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-white/70 text-xs font-medium">Total Bridges</span>
                    <span className="text-white text-xs md:text-sm font-bold">
                      <AnimatedCounter value={totalBridges} formatFn={formatNumber} />
                    </span>
                  </div>
                  <div className="h-0.5 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white/80 to-white/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalBridges / 100) * 100, 100)}%` }}
                      transition={{ delay: 1.4, duration: 1 }}
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-white/70 text-xs font-medium">Total Volume</span>
                    <span className="text-white text-xs md:text-sm font-bold">
                      {formatUSD(totalVolumeUSD)}
                    </span>
                  </div>
                  <div className="h-0.5 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white/70 to-white/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalVolumeUSD / 100000) * 100, 100)}%` }}
                      transition={{ delay: 1.6, duration: 1 }}
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-white/70 text-xs font-medium">Avg Transaction</span>
                    <span className="text-white text-xs md:text-sm font-bold">
                      {formatUSD(avgTransactionVolume)}
                    </span>
                  </div>
                  <div className="h-0.5 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white/60 to-white/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((avgTransactionVolume / 10000) * 100, 100)}%` }}
                      transition={{ delay: 1.8, duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Card Description */}
              <motion.div
                className="px-3 py-2 bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <p className="text-white/90 text-[10px] md:text-xs text-center leading-snug italic">
                  &quot;{userClass.description}&quot;
                </p>
              </motion.div>

              {/* Card Footer - Rarity indicator */}
              <motion.div
                className="px-3 py-1.5 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <div className="flex gap-0.5">
                  {[...Array(userClass.rarity)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-base bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm"
                      style={{ WebkitTextStroke: '0.5px rgba(202, 138, 4, 0.3)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.3 + i * 0.1 }}
                    >★</motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Holographic effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </motion.div>

        <motion.p
          className="text-xs md:text-sm text-white/60 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          Based on your bridging history and patterns
        </motion.p>
      </div>
    </SlideContainer>
  );
}
