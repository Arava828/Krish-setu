import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', border: '1.5px solid #d1fae5', boxShadow: '0 20px 60px rgba(21,128,61,.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌾</div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2e1a', marginBottom: '6px' }}>Welcome back</h1>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Log in to your Krishi Setu account</p>
          </div>
          <form onSubmit={submit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email address</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Your password"
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <div style={{ marginTop: '16px', background: '#f0fdf4', borderRadius: '10px', padding: '12px', border: '1px solid #d1fae5' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>Demo credentials</div>
            <div style={{ fontSize: '11px', color: '#374151' }}>
              Farmer: <b>farmer@demo.com</b> / <b>demo123</b><br />
              Buyer: <b>buyer@demo.com</b> / <b>demo123</b>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}