'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  label: string;
  value: number;
  formatFn?: (value: number) => string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatCard({
  label,
  value,
  formatFn,
  suffix,
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && <div className="text-purple-400">{icon}</div>}
        <p className="text-white/60 text-sm font-medium">{label}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedCounter
          value={value}
          formatFn={formatFn}
          className="text-3xl font-bold text-white"
        />
        {suffix && <span className="text-white/60 text-lg">{suffix}</span>}
      </div>
    </motion.div>
  );
}
