import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#fff', borderBottom: '1.5px solid #d1fae5', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(21,128,61,0.06)' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#15803d,#4ade80)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌾</div>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#15803d' }}>Krishi Setu</span>
      </Link>

      <div style={{ display: 'flex', gap: '6px' }}>
        {[['/', 'Home'], ['/crops', 'Browse crops']].map(([path, label]) => (
          <Link key={path} to={path} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', background: isActive(path) ? '#f0fdf4' : 'transparent', color: isActive(path) ? '#15803d' : '#4b5563' }}>{label}</Link>
        ))}
        {user?.role === 'farmer' && <Link to="/farmer/dashboard" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: isActive('/farmer/dashboard') ? '#15803d' : '#4b5563', background: isActive('/farmer/dashboard') ? '#f0fdf4' : 'transparent' }}>Dashboard</Link>}
        {user?.role === 'buyer' && <Link to="/buyer/dashboard" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: isActive('/buyer/dashboard') ? '#15803d' : '#4b5563', background: isActive('/buyer/dashboard') ? '#f0fdf4' : 'transparent' }}>Dashboard</Link>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <>
            {user.role === 'farmer' && <Link to="/farmer/add-crop" style={{ background: '#15803d', color: '#fff', padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>+ Add crop</Link>}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: '9px', padding: '6px 12px', cursor: 'pointer' }}>
                <div style={{ width: '28px', height: '28px', background: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>{user.name?.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '44px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '6px', minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{user.role === 'farmer' ? '👨‍🌾 Farmer' : '🛒 Buyer'}</div>
                  </div>
                  <Link to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#374151', textDecoration: 'none', borderRadius: '8px' }}>Dashboard</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#374151', textDecoration: 'none', borderRadius: '8px' }}>My orders</Link>
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: '#374151', border: '1.5px solid #d1d5db' }}>Log in</Link>
            <Link to="/register" style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', color: '#fff', background: '#15803d' }}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}