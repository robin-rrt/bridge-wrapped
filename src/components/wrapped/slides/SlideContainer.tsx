'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideContainerProps {
  children: ReactNode;
  gradient: string;
}

export function SlideContainer({ children, gradient }: SlideContainerProps) {
  return (
    <motion.div
      className={`min-h-screen w-full flex flex-col items-center justify-center px-8 py-24 md:px-24 md:py-32 lg:px-32 lg:py-40 bg-gradient-to-br ${gradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl w-full text-center">{children}</div>
    </motion.div>
  );
}
