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
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 md:px-12 md:py-20 bg-gradient-to-br ${gradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl w-full text-center">{children}</div>
    </motion.div>
  );
}
