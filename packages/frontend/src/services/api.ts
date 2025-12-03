import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStats = async () => {
  // Use Promise.allSettled to ensure partial failures don't crash the whole dashboard
  const [priceRes, blockRes, analyticsRes] = await Promise.allSettled([
    api.get('/price').catch(e => ({ data: { zec: { usd: 0, usd_24h_change: 0 } } })), // Fallback default
    api.get('/transactions?limit=1').catch(e => ({ data: { data: { transactions: [] } } })),
    api.get('/analytics/network-stats').catch(e => ({ data: { data: { networkHashrate: 0 } } }))
  ]);

  // Helper to safely extract value
  const getValue = (result: any) => result.status === 'fulfilled' ? result.value?.data : null;

  const priceData = getValue(priceRes) as any;
  const blockData = getValue(blockRes) as any;
  const analyticsData = getValue(analyticsRes) as any;

  // Prioritize Price Root or /zec structure (handled by backend alias now, but safe to check)
  const price = priceData?.zec?.usd || priceData?.data?.zec?.usd || 0;
  const priceChange = priceData?.zec?.usd_24h_change || priceData?.data?.zec?.usd_24h_change || 0;

  return {
    price,
    priceChange,
    blockHeight: blockData?.data?.transactions?.[0]?.blockHeight || 0,
    // Add new fields from analytics, defaulting to 0 if call failed
    networkHashrate: analyticsData?.data?.networkHashrate || 0,
    shieldedPoolSize: analyticsData?.data?.shieldedPoolSize || 0,
    totalShieldedTransactions: analyticsData?.data?.totalShieldedTransactions || 0
  };
};

export const getTransactions = async (params: any) => {
  const response = await api.get('/transactions', { params });
  return (response.data as any).data;
};

export const getTransactionByHash = async (hash: string) => {
  const response = await api.get(`/transactions/${hash}`);
  return response.data;
};

export const getWalletTransactions = async (viewingKey: string) => {
  const response = await api.get('/transactions/by-viewing-key', {
    params: { viewingKey }
  });
  return response.data;
};
