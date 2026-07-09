import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const statusColor = { available:['#dcfce7','#166534'], reserved:['#fef9c3','#854d0e'], sold:['#f3f4f6','#374151'] };
const orderStatus = { pending:['#fef9c3','#854d0e'], confirmed:['#dcfce7','#166534'], shipped:['#dbeafe','#1e40af'], delivered:['#dcfce7','#166534'], cancelled:['#fee2e2','#991b1b'] };

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weather, setWeather] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const city = user?.location?.district || 'Bangalore';
        const [statsRes, cropsRes, ordersRes, weatherRes] = await Promise.all([
          API.get('/users/farmer-stats'),
          API.get('/crops/my-listings'),
          API.get('/orders/received'),
          API.get(`/weather?city=${city}`)
        ]);
        setStats(statsRes.data);
        setCrops(cropsRes.data.crops || []);
        setOrders(ordersRes.data.orders || []);
        setWeather(weatherRes.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Order updated!');
    } catch { toast.error('Failed to update order'); }
  };

  const deleteCrop = async (cropId) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await API.delete(`/crops/${cropId}`);
      setCrops(crops.filter(c => c._id !== cropId));
      toast.success('Listing removed');
    } catch { toast.error('Failed to remove listing'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #d1fae5', borderTop: '4px solid #15803d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontSize: '14px', color: '#6b7280' }}>Loading your dashboard...</div>
    </div>
  );

  const kpiData = [
    { label: 'Active listings', value: stats?.activeCrops ?? crops.filter(c=>c.status==='available').length, icon: '🌿', color: '#15803d', bg: '#f0fdf4' },
    { label: 'Pending orders', value: orders.filter(o=>o.status==='pending').length, icon: '📦', color: '#d97706', bg: '#fef9c3' },
    { label: 'Delivered', value: stats?.completedOrders ?? 0, icon: '✅', color: '#1d4ed8', bg: '#dbeafe' },
    { label: 'Total revenue', value: stats?.totalRevenue ? `₹${(stats.totalRevenue/100000).toFixed(1)}L` : '₹0', icon: '💰', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: '16px', padding: '18px 22px', border: '1.5px solid #d1fae5', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg,#15803d,#4ade80)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a2e1a' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>📍 {user?.location?.district}, {user?.location?.state} · 👨‍🌾 Farmer</div>
          </div>
        </div>
        <Link to="/farmer/add-crop" style={{ background: '#15803d', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
          + Add crop listing
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        {kpiData.map((k,i) => (
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
        {[['overview','📊 Overview'],['listings','🌿 My listings'],['orders','📦 Orders']].map(([tab,label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: activeTab===tab ? '#15803d' : 'transparent', color: activeTab===tab ? '#fff' : '#6b7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '16px' }}>📦 Recent orders</div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>No orders yet</div>
              </div>
            ) : orders.slice(0,5).map(order => (
              <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{order.buyer?.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{order.crop?.name} · ₹{order.totalAmount?.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: orderStatus[order.status]?.[0], color: orderStatus[order.status]?.[1] }}>{order.status}</span>
                  {order.status === 'pending' && (
                    <button onClick={() => updateOrderStatus(order._id,'confirmed')} style={{ background: '#15803d', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            {weather && (
              <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', borderRadius: '14px', padding: '18px', color: '#fff', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600, marginBottom: '10px' }}>📍 {weather.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '36px' }}>🌤️</span>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 900 }}>{weather.temperature}°C</div>
                    <div style={{ fontSize: '13px', color: '#bfdbfe' }}>{weather.description}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#dbeafe', background: 'rgba(255,255,255,.1)', borderRadius: '8px', padding: '8px 10px', lineHeight: 1.5 }}>
                  🌱 {weather.farmingTip}
                </div>
              </div>
            )}
            <div style={{ background: 'linear-gradient(135deg,#2e1065,#4c1d95)', borderRadius: '14px', padding: '18px', color: '#fff' }}>
              <div style={{ fontSize: '10px', color: '#c4b5fd', fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '8px' }}>🤖 AI price recommendation</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#e9d5ff', marginBottom: '4px' }}>₹28 – 32 / kg</div>
              <div style={{ fontSize: '11px', color: '#c4b5fd', marginBottom: '10px' }}>Tomatoes · Based on regional mandi data</div>
              <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#ddd6fe', lineHeight: 1.5 }}>
                📈 Prices trending up 12% this week. Good time to list more stock!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>🌿 Your listings ({crops.length})</div>
            <Link to="/farmer/add-crop" style={{ background: '#15803d', color: '#fff', padding: '7px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>+ Add new</Link>
          </div>
          {crops.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌱</div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>No listings yet</div>
              <Link to="/farmer/add-crop" style={{ background: '#15803d', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>Add first listing</Link>
            </div>
          ) : crops.map(crop => (
            <div key={crop._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🌿</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{crop.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{crop.quantity?.amount} {crop.quantity?.unit} · ₹{crop.price?.amount}/{crop.price?.per}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: statusColor[crop.status]?.[0], color: statusColor[crop.status]?.[1] }}>{crop.status}</span>
                <button onClick={() => deleteCrop(crop._id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', fontWeight: 800 }}>📦 All orders ({orders.length})</div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>No orders yet</div>
            </div>
          ) : orders.map(order => (
            <div key={order._id} style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Order from {order.buyer?.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{order.crop?.name} · {order.quantity?.amount} {order.quantity?.unit} · <span style={{ fontWeight: 700, color: '#15803d' }}>₹{order.totalAmount?.toLocaleString()}</span></div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>📞 {order.buyer?.phone}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: orderStatus[order.status]?.[0], color: orderStatus[order.status]?.[1] }}>{order.status}</span>
                  {order.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => updateOrderStatus(order._id,'confirmed')} style={{ background: '#15803d', color: '#fff', border: 'none', borderRadius: '7px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                      <button onClick={() => updateOrderStatus(order._id,'cancelled')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '7px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => updateOrderStatus(order._id,'shipped')} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '7px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Mark shipped</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
