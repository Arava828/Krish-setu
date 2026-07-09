import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const sc = (s) => {
  const map = { pending:['#fef9c3','#854d0e'], confirmed:['#dcfce7','#166534'], shipped:['#dbeafe','#1e40af'], delivered:['#dcfce7','#166534'], cancelled:['#fee2e2','#991b1b'] };
  return { background: map[s]?.[0]||'#f3f4f6', color: map[s]?.[1]||'#374151' };
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recentCrops, setRecentCrops] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, ordersRes, cropsRes] = await Promise.all([
          API.get('/users/buyer-stats'),
          API.get('/orders/my-orders'),
          API.get('/crops?limit=6')
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders || []);
        setRecentCrops(cropsRes.data.crops || []);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #dbeafe', borderTop: '4px solid #1d4ed8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontSize: '14px', color: '#6b7280' }}>Loading your dashboard...</div>
    </div>
  );

  const kpis = [
    { label: 'Total orders', value: stats?.totalOrders ?? orders.length, icon: '📦', color: '#1d4ed8', bg: '#dbeafe' },
    { label: 'Pending', value: stats?.pendingOrders ?? orders.filter(o=>o.status==='pending').length, icon: '⏳', color: '#d97706', bg: '#fef9c3' },
    { label: 'Delivered', value: stats?.deliveredOrders ?? orders.filter(o=>o.status==='delivered').length, icon: '✅', color: '#15803d', bg: '#dcfce7' },
    { label: 'Total spent', value: stats?.totalSpent ? `₹${(stats.totalSpent/1000).toFixed(0)}K` : '₹0', icon: '💳', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#eff6ff', padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: '16px', padding: '18px 22px', border: '1.5px solid #bfdbfe', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg,#1d4ed8,#60a5fa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a5f' }}>Welcome, {user?.name?.split(' ')[0]} 👋</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>📍 {user?.location?.district}, {user?.location?.state} · 🛒 Buyer</div>
          </div>
        </div>
        <Link to="/crops" style={{ background: '#1d4ed8', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
          🛒 Browse fresh crops →
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        {kpis.map((k,i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>{k.label}</span>
              <div style={{ width: '32px', height: '32px', background: k.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '5px', border: '1.5px solid #e5e7eb', marginBottom: '20px', width: 'fit-content' }}>
        {[['overview','📊 Overview'],['orders','📦 My orders'],['browse','🌿 Browse']].map(([tab,label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: activeTab===tab ? '#1d4ed8' : 'transparent', color: activeTab===tab ? '#fff' : '#6b7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a5f', marginBottom: '16px' }}>📦 Recent orders</div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>No orders yet</div>
                <Link to="/crops" style={{ background: '#1d4ed8', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Start shopping</Link>
              </div>
            ) : orders.slice(0,5).map(order => (
              <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{order.crop?.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>from {order.farmer?.name} · ₹{order.totalAmount?.toLocaleString()}</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', ...sc(order.status) }}>{order.status}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1.5px solid #e5e7eb', marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a5f', marginBottom: '14px' }}>🌿 Fresh today</div>
              {recentCrops.slice(0,3).map(crop => (
                <Link key={crop._id} to={`/crops/${crop._id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none' }}>
                  <div style={{ width: '36px', height: '36px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌿</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{crop.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{crop.farmer?.name}</div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#15803d' }}>₹{crop.price?.amount}/{crop.price?.per}</span>
                </Link>
              ))}
              <Link to="/crops" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>View all crops →</Link>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', borderRadius: '14px', padding: '18px', color: '#fff' }}>
              <div style={{ fontSize: '12px', color: '#bfdbfe', fontWeight: 600, marginBottom: '8px' }}>💡 Buyer tip</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', lineHeight: 1.4 }}>Order directly from farmers. Save 20–40% vs retail prices.</div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', fontWeight: 800, color: '#1e3a5f' }}>📦 All my orders ({orders.length})</div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>No orders yet</div>
              <Link to="/crops" style={{ background: '#1d4ed8', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>Browse crops</Link>
            </div>
          ) : orders.map(order => (
            <div key={order._id} style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{order.crop?.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '3px' }}>from {order.farmer?.name} · {order.quantity?.amount} {order.quantity?.unit} · <span style={{ fontWeight: 700, color: '#1d4ed8' }}>₹{order.totalAmount?.toLocaleString()}</span></div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize', ...sc(order.status) }}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {recentCrops.map(crop => (
              <Link key={crop._id} to={`/crops/${crop._id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e5e7eb', display: 'block', transition: 'all .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#60a5fa';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.transform='none';}}>
                <div style={{ height: '80px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🌿</div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{crop.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>📍 {crop.location?.district}, {crop.location?.state}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1d4ed8' }}>₹{crop.price?.amount}/{crop.price?.per}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/crops" style={{ background: '#1d4ed8', color: '#fff', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>View all crops →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
