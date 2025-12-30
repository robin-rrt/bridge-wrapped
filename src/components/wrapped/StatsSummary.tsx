'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { BridgeWrappedStats } from '@/types';
import { formatNumber, formatUSD, truncateAddress, formatDate } from '@/lib/utils';
import { getChainColor } from '@/services/chains/chainInfo';
import { classifyUser } from '@/lib/userClassification';

interface StatsSummaryProps {
  stats: BridgeWrappedStats;
  onViewWrapped: () => void;
}

export function StatsSummary({ stats, onViewWrapped }: StatsSummaryProps) {
  // Calculate user class
  const userClass = classifyUser(stats.transactions, stats.totalVolumeUSD);

  // Prepare chart data
  const monthlyData = stats.monthlyActivity.map((m) => ({
    name: m.monthName.substring(0, 3),
    bridges: m.count,
    volume: m.volumeUSD,
  }));

  const chainData = stats.topDestinationChains.map((chain) => ({
    name: chain.chainName,
    value: chain.count,
    color: getChainColor(chain.chainId),
  }));


  return (
    <div className="min-h-screen bg-black p-6 md:p-10 lg:p-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Bridge Wrapped {stats.year}
          </h1>
          <p className="text-white/60">
            {truncateAddress(stats.walletAddress, 8)}
          </p>
          <button
            onClick={onViewWrapped}
            className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium"
          >
            View Wrapped Experience
          </button>
        </motion.div>

        {/* User Class Card - With breathing room */}
        <motion.div
          className="flex justify-center mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative bg-gradient-to-br from-white/40 via-white/20 to-white/40 p-0.5 rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-5 md:gap-6 p-5 md:p-6 lg:p-8">
                {/* Class Image */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={userClass.image}
                    alt={userClass.title}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                {/* Class Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 uppercase tracking-wide mb-1">
                    Your Cross-chain Class
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {userClass.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {userClass.description.split('.')[0]}.
                  </p>
                </div>
                {/* Stars */}
                <div className="flex flex-col gap-0.5">
                  {[...Array(userClass.rarity)].map((_, i) => (
                    <span
                      key={i}
                      className="text-white/80 text-sm"
                    >★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Table */}
        <motion.div
          className="w-full max-w-4xl mx-auto bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 divide-x divide-white/10">
            <div className="p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Total Bridges</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {formatNumber(stats.totalBridgingActions)}
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Total Volume</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {formatUSD(stats.totalVolumeUSD)}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
            <div className="p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Top Source</p>
              <p className="text-xl md:text-2xl font-semibold text-white">
                {stats.mostUsedSourceChain?.chainName || 'N/A'}
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Top Destination</p>
              <p className="text-xl md:text-2xl font-semibold text-white">
                {stats.mostUsedDestinationChain?.chainName || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-12 md:mb-16 px-4 md:px-6">
          {/* Monthly Activity */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 md:p-6 lg:p-8 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Bridging Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                  labelStyle={{ color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar
                  dataKey="bridges"
                  fill="url(#grayGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="grayGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#6b6b6b" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Destination Chains Pie */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 md:p-6 lg:p-8 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Destination Chains
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {chainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                  labelStyle={{ color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Provider Breakdown Table */}
        <motion.div
          className="w-full max-w-4xl mx-auto bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white text-center">
              Bridges by Provider
            </h3>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div className="p-5 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">ACROSS</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stats.providerBreakdown.across.count}
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">RELAY</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stats.providerBreakdown.relay.count}
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">LIFI</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stats.providerBreakdown.lifi.count}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Tokens Section */}
        <div className="w-full max-w-6xl mb-12 md:mb-16 px-4 md:px-6">

          {/* Top Tokens */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 md:p-6 lg:p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Most Bridged Tokens
            </h3>
            <div className="space-y-3">
              {stats.topTokens.slice(0, 5).map((token, index) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm w-6">
                      #{index + 1}
                    </span>
                    <span className="text-white font-medium">
                      {token.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{token.count} times</p>
                    <p className="text-white/50 text-sm">
                      {formatUSD(token.totalVolumeUSD)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Busiest Day */}
        {stats.busiestDay && (
          <motion.div
            className="w-full max-w-4xl bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-white/60 mb-2">Your Busiest Day</p>
            <p className="text-2xl font-bold text-white mb-1">
              {formatDate(stats.busiestDay.date)}
            </p>
            <p className="text-white/80">
              You bridged{' '}
              <span className="font-semibold text-white">
                {stats.busiestDay.count} times
              </span>{' '}
              to{' '}
              <span className="font-semibold text-white/90">
                {stats.busiestDay.primaryDestination.chainName}
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
