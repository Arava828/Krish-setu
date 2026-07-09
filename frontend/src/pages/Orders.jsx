import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const statusColors = { pending:'#fef9c3,#854d0e', confirmed:'#dcfce7,#166534', shipped:'#dbeafe,#1e40af', delivered:'#dcfce7,#166534', cancelled:'#fee2e2,#991b1b' };
const sc = (s) => { const [bg,c]=(statusColors[s]||'#f3f4f6,#374151').split(','); return {background:bg,color:c}; };

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = user?.role === 'farmer' ? '/orders/received' : '/orders/my-orders';
        const res = await API.get(endpoint);
        setOrders(res.data.orders || []);
      } catch { setOrders([]); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #d1fae5', borderTop: '4px solid #15803d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '28px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>
          📦 {user?.role === 'farmer' ? 'Received orders' : 'My orders'} ({orders.length})
        </h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#374151' }}>No orders yet</div>
          </div>
        ) : orders.map(order => (
          <div key={order._id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{order.crop?.name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  {user?.role === 'farmer' ? `Buyer: ${order.buyer?.name}` : `Farmer: ${order.farmer?.name}`}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {order.quantity?.amount} {order.quantity?.unit} · <span style={{ fontWeight: 700, color: '#15803d' }}>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize', ...sc(order.status) }}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}