'use client';

import { motion } from 'framer-motion';
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

interface StatsSummaryProps {
  stats: BridgeWrappedStats;
  onViewWrapped: () => void;
}

export function StatsSummary({ stats, onViewWrapped }: StatsSummaryProps) {
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

  const providerData = [
    { name: 'Across', value: stats.providerBreakdown.across.count, color: '#6BFFC0' },
    { name: 'Relay', value: stats.providerBreakdown.relay.count, color: '#FFD166' },
    { name: 'LiFi', value: stats.providerBreakdown.lifi.count, color: '#EF476F' },
  ].filter((p) => p.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Bridge Wrapped {stats.year}
          </h1>
          <p className="text-white/60">
            {truncateAddress(stats.walletAddress, 8)}
          </p>
          <button
            onClick={onViewWrapped}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            View Wrapped Experience
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white/60 text-sm mb-1">Total Bridges</p>
            <p className="text-3xl font-bold text-white">
              {formatNumber(stats.totalBridgingActions)}
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white/60 text-sm mb-1">Total Volume</p>
            <p className="text-3xl font-bold text-white">
              {formatUSD(stats.totalVolumeUSD)}
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/60 text-sm mb-1">Top Source Chain</p>
            <p className="text-2xl font-bold text-white">
              {stats.mostUsedSourceChain?.chainName || 'N/A'}
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white/60 text-sm mb-1">Top Destination</p>
            <p className="text-2xl font-bold text-white">
              {stats.mostUsedDestinationChain?.chainName || 'N/A'}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Activity */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
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
                    backgroundColor: '#1e1b4b',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Bar
                  dataKey="bridges"
                  fill="url(#purpleGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="purpleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Destination Chains Pie */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
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
                    backgroundColor: '#1e1b4b',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Provider Breakdown & Top Token */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Provider Breakdown */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Bridges by Provider
            </h3>
            <div className="space-y-4">
              {providerData.map((provider) => (
                <div key={provider.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{provider.name}</span>
                    <span className="text-white/60">
                      {provider.value} bridges
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: provider.color }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (provider.value / stats.totalBridgingActions) * 100
                        }%`,
                      }}
                      transition={{ delay: 0.8, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Tokens */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
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
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
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
              <span className="font-semibold text-purple-400">
                {stats.busiestDay.count} times
              </span>{' '}
              to{' '}
              <span className="font-semibold text-pink-400">
                {stats.busiestDay.primaryDestination.chainName}
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
