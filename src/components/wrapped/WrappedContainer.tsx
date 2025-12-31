'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BridgeWrappedStats } from '@/types';
import { IntroSlide } from './slides/IntroSlide';
import { TotalBridgesSlide } from './slides/TotalBridgesSlide';
import { TopSourceChainSlide } from './slides/TopSourceChainSlide';
import { TopDestinationSlide } from './slides/TopDestinationSlide';
import { VolumeSlide } from './slides/VolumeSlide';
import { TopTokenSlide } from './slides/TopTokenSlide';
import { BusiestDaySlide } from './slides/BusiestDaySlide';
import { UserClassSlide } from './slides/UserClassSlide';
import { AvailNexusSlide } from './slides/AvailNexusSlide';
import { SummarySlide } from './slides/SummarySlide';
import { classifyUser } from '@/lib/userClassification';

interface WrappedContainerProps {
  stats: BridgeWrappedStats;
  onComplete?: () => void;
}

type SlideType =
  | 'intro'
  | 'totalBridges'
  | 'topSource'
  | 'topDestination'
  | 'volume'
  | 'topToken'
  | 'busiestDay'
  | 'userClass'
  | 'availNexus'
  | 'summary';

export function WrappedContainer({ stats, onComplete }: WrappedContainerProps) {
  // Calculate user class
  const userClass = classifyUser(stats.transactions, stats.totalVolumeUSD);
  const avgTransactionVolume = stats.totalBridgingActions > 0
    ? stats.totalVolumeUSD / stats.totalBridgingActions
    : 0;

  // Build slides array based on available data
  const availableSlides: SlideType[] = ['intro', 'totalBridges'];

  if (stats.mostUsedSourceChain) {
    availableSlides.push('topSource');
  }
  if (stats.mostUsedDestinationChain) {
    availableSlides.push('topDestination');
  }
  if (stats.totalVolumeUSD > 0) {
    availableSlides.push('volume');
  }
  if (stats.mostBridgedToken) {
    availableSlides.push('topToken');
  }
  if (stats.busiestDay) {
    availableSlides.push('busiestDay');
  }
  // Add user class slide after stats slides, before Avail Nexus
  availableSlides.push('userClass');
  availableSlides.push('availNexus');
  availableSlides.push('summary');

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = availableSlides[currentSlideIndex];

  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < availableSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentSlideIndex, availableSlides.length, onComplete]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [currentSlideIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Handle touch/click navigation
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;

    if (isLeftHalf) {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 'intro':
        return <IntroSlide year={stats.year} />;
      case 'totalBridges':
        return (
          <TotalBridgesSlide
            totalBridges={stats.totalBridgingActions}
            year={stats.year}
          />
        );
      case 'topSource':
        return stats.mostUsedSourceChain ? (
          <TopSourceChainSlide chain={stats.mostUsedSourceChain} />
        ) : null;
      case 'topDestination':
        return stats.mostUsedDestinationChain ? (
          <TopDestinationSlide chain={stats.mostUsedDestinationChain} />
        ) : null;
      case 'volume':
        return (
          <VolumeSlide
            totalVolume={stats.totalVolumeUSD}
            highestVolumeChain={stats.highestVolumeDestination}
          />
        );
      case 'topToken':
        return stats.mostBridgedToken ? (
          <TopTokenSlide token={stats.mostBridgedToken} />
        ) : null;
      case 'busiestDay':
        return stats.busiestDay ? (
          <BusiestDaySlide busiestDay={stats.busiestDay} />
        ) : null;
      case 'userClass':
        return (
          <UserClassSlide
            userClass={userClass}
            totalBridges={stats.totalBridgingActions}
            totalVolumeUSD={stats.totalVolumeUSD}
            avgTransactionVolume={avgTransactionVolume}
            walletAddress={stats.walletAddress}
          />
        );
      case 'availNexus':
        return <AvailNexusSlide />;
      case 'summary':
        return <SummarySlide stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">{renderSlide()}</AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {availableSlides.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlideIndex
                ? 'w-8 bg-white'
                : index < currentSlideIndex
                ? 'w-4 bg-white/60'
                : 'w-4 bg-white/30'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm z-10">
        Tap or use arrow keys to navigate
      </div>

      {/* Navigation arrows */}
      {currentSlideIndex > 0 && (
        <motion.button
          className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            goToPrevSlide();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
      )}

      {currentSlideIndex < availableSlides.length - 1 && (
        <motion.button
          className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            goToNextSlide();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
