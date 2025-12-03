import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { Activity, Zap, TrendingUp, Hash } from 'lucide-react';

// Mock historical data since we don't have a full indexer history yet
const mockHistoryData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  transactions: Math.floor(Math.random() * 50) + 10,
  hashrate: 400 + Math.random() * 100,
  price: 30 + Math.random() * 5
}));

export const Analytics = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 10000
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-500/10 mb-4 ring-1 ring-indigo-500/30">
          <Activity className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Network Analytics</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Real-time metrics and historical trends of the Zcash network, powered by Zscreener's indexer.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">ZEC Price</p>
          </div>
          <p className="text-2xl font-bold text-white">${stats?.price?.toFixed(2) || '0.00'}</p>
          <p className={`text-xs mt-1 ${stats?.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats?.priceChange > 0 ? '+' : ''}{stats?.priceChange?.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Network Hashrate</p>
          </div>
          <p className="text-2xl font-bold text-white">{(stats?.networkHashrate || 0).toLocaleString()} MSol/s</p>
          <p className="text-xs text-slate-500 mt-1">Global mining power</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Hash className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Block Height</p>
          </div>
          <p className="text-2xl font-bold text-white">{(stats?.blockHeight || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Latest synced block</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Pool Size</p>
          </div>
          <p className="text-2xl font-bold text-white">{(stats?.shieldedPoolSize || 0).toLocaleString()} ZEC</p>
          <p className="text-xs text-slate-500 mt-1">Total shielded value</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">24h Transaction Volume</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="transactions" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Hashrate Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Network Hashrate Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHistoryData}>
                <defs>
                  <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hashrate" stroke="#10b981" fillOpacity={1} fill="url(#colorHashrate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">ZEC Price History</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
