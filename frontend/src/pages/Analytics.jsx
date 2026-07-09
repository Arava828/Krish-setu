import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = user?.role === 'farmer' ? '/users/farmer-stats' : '/users/buyer-stats';
        const res = await API.get(endpoint);
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #d1fae5', borderTop: '4px solid #15803d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const monthlyData = [
    { month: 'Feb', value: 12000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 15000 },
    { month: 'May', value: 25000 },
    { month: 'Jun', value: 32000 },
    { month: 'Jul', value: 28000 },
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.value));

  const cropDemand = [
    { name: 'Tomatoes', demand: 85, color: '#ef4444' },
    { name: 'Rice', demand: 72, color: '#f59e0b' },
    { name: 'Onions', demand: 68, color: '#8b5cf6' },
    { name: 'Mangoes', demand: 91, color: '#f97316' },
    { name: 'Chilli', demand: 60, color: '#ec4899' },
  ];

  const kpiData = [
    { label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 128000)/1000).toFixed(0)}K`, icon: '💰', color: '#15803d', bg: '#f0fdf4', change: '+18%' },
    { label: 'Total Orders', value: stats?.totalOrders || 47, icon: '📦', color: '#1d4ed8', bg: '#dbeafe', change: '+12%' },
    { label: 'Active Crops', value: stats?.activeCrops || 7, icon: '🌿', color: '#d97706', bg: '#fef9c3', change: '+3%' },
    { label: 'Avg Order Value', value: '₹2,840', icon: '📈', color: '#7c3aed', bg: '#f5f3ff', change: '+8%' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2e1a' }}>📊 Analytics Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Your performance insights and market trends</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {kpiData.map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>{k.label}</span>
              <div style={{ width: '32px', height: '32px', background: k.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: k.color, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>↑ {k.change} this month</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Revenue Chart */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>💰 Monthly Revenue</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px', paddingBottom: '8px' }}>
            {monthlyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>₹{(d.value/1000).toFixed(0)}K</div>
                <div style={{ width: '100%', background: 'linear-gradient(180deg,#15803d,#4ade80)', borderRadius: '6px 6px 0 0', height: `${(d.value/maxVal)*130}px`, transition: 'all .3s', cursor: 'pointer', minHeight: '20px' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'} />
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Demand */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '16px' }}>🌾 Crop Demand Index</div>
          {cropDemand.map((c, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{c.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: c.color }}>{c.demand}%</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.demand}%`, background: c.color, borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>

        {/* Sales by Category */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '16px' }}>🥧 Sales by Category</div>
          {[
            { cat: 'Vegetables', pct: 35, color: '#15803d' },
            { cat: 'Fruits', pct: 28, color: '#f97316' },
            { cat: 'Grains', pct: 22, color: '#f59e0b' },
            { cat: 'Spices', pct: 15, color: '#ef4444' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{c.cat}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c.color }}>{c.pct}%</div>
            </div>
          ))}
        </div>

        {/* Top Crops */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '16px' }}>🏆 Top Crops</div>
          {[
            { name: 'Alphonso Mango', revenue: '₹45K', orders: 18, trend: '↑' },
            { name: 'Basmati Rice', revenue: '₹38K', orders: 12, trend: '↑' },
            { name: 'Red Tomatoes', revenue: '₹22K', orders: 24, trend: '↓' },
            { name: 'Guntur Chilli', revenue: '₹19K', orders: 8, trend: '↑' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.orders} orders</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>{c.revenue}</div>
                <div style={{ fontSize: '11px', color: c.trend === '↑' ? '#15803d' : '#ef4444', fontWeight: 700 }}>{c.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '16px' }}>⚡ Quick Stats</div>
          {[
            { label: 'Avg delivery time', value: '2.4 days', icon: '🚚' },
            { label: 'Customer satisfaction', value: '94%', icon: '⭐' },
            { label: 'Repeat buyers', value: '68%', icon: '🔄' },
            { label: 'Crops listed this month', value: '7', icon: '🌿' },
            { label: 'States reached', value: '5', icon: '🗺️' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '16px' }}>{s.icon}</span>
              <div style={{ flex: 1, fontSize: '12px', color: '#6b7280' }}>{s.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}