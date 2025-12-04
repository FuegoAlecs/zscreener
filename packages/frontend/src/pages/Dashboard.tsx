import { useQuery } from '@tanstack/react-query';
import { getStats, getTransactions } from '../services/api';
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Box,
  Cpu,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16 text-indigo-500" />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:text-indigo-300 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
          trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

export const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 10000
  });

  const { data: txData } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions({ limit: 5 }),
    refetchInterval: 5000
  });

  // Helper to format Hashrate (Sol/s to MS/s, GS/s)
  const formatHashrate = (solps: number) => {
    if (!solps) return '0 Sol/s';
    if (solps > 1e9) return `${(solps / 1e9).toFixed(2)} GS/s`;
    if (solps > 1e6) return `${(solps / 1e6).toFixed(2)} MS/s`;
    return `${solps.toFixed(2)} Sol/s`;
  };

  // Helper to format Pool Size (ZEC)
  // Assuming shieldedPoolSize is in zatoshis, need to convert to ZEC?
  // Backend demo generator might store full ZEC units or Zatoshis.
  // Given the demo generator uses `Math.floor(random * 5)`, it seems to be small numbers (ZEC?)
  // Let's assume the DB stores ZEC units for demo purposes to be visible.
  const formatPoolSize = (size: number, price: number) => {
     if (!size) return '$0.00';
     // If size is massive (Zatoshis), scale it. If small (Demo ZEC), keep it.
     // Demo generator makes inputs like 1-5. Real mainnet has millions.
     // Let's treat it as ZEC units for now since we are in Demo Mode.
     const zec = size;
     const usd = zec * (price || 0);

     if (usd > 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
     if (usd > 1e3) return `$${(usd / 1e3).toFixed(1)}K`;
     return `$${usd.toFixed(2)}`;
  };

  // Mock chart data for visualization (to be replaced with live volume data later)
  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="ZEC Price"
          value={`$${stats?.price?.toFixed(2) || '0.00'}`}
          change={stats?.priceChange?.toFixed(2)}
          trend={stats?.priceChange >= 0 ? 'up' : 'down'}
          icon={Activity}
        />
        <StatCard
          title="Latest Block"
          value={stats?.blockHeight?.toLocaleString() || '0'}
          icon={Box}
        />
        <StatCard
          title="Network Hashrate"
          value={formatHashrate(stats?.networkHashrate)}
          // change="2.1" // Removed hardcoded change
          // trend="up"
          icon={Cpu}
        />
        <StatCard
          title="Shielded Pool Value"
          value={formatPoolSize(stats?.shieldedPoolSize, stats?.price)}
          // change="0.8" // Removed hardcoded change
          // trend="up"
          icon={ShieldCheck}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Network Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {/* Fix type error by casting or optional chaining */}
            {(txData as any)?.transactions?.map((tx: any) => (
              <div key={tx.txHash} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white font-mono">
                      {tx.txHash.substring(0, 8)}...
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {tx.shieldedOutputs} Shielded
                  </div>
                </div>
              </div>
            ))}
            {!(txData as any)?.transactions?.length && (
              <div className="text-center py-8 text-slate-500">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
