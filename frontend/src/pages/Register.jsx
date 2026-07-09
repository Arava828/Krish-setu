import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const indianStates = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', state: '', district: '' });
  const [farmerExtras, setFarmerExtras] = useState({ farmSize: '', experience: '' });
  const [buyerExtras, setBuyerExtras] = useState({ businessName: '', businessType: 'retailer' });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = {
        ...form, role,
        location: { state: form.state, district: form.district },
        ...(role === 'farmer' ? { farmDetails: { farmSize: Number(farmerExtras.farmSize), experience: Number(farmerExtras.experience) } } : {}),
        ...(role === 'buyer' ? { buyerDetails: buyerExtras } : {})
      };
      const user = await register(payload);
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 20px' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', border: '1.5px solid #d1fae5', boxShadow: '0 20px 60px rgba(21,128,61,.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌾</div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2e1a' }}>Create your account</h1>
          </div>
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
            {[['farmer','👨‍🌾 I am a farmer'],['buyer','🛒 I am a buyer']].map(([r,label]) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                style={{ flex: 1, padding: '10px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: role===r ? '#15803d' : 'transparent', color: role===r ? '#fff' : '#6b7280' }}>
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Full name *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Ramesh Gowda" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="9876543210" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password * <span style={{ color: '#9ca3af', fontWeight: 400 }}>(min 6 chars)</span></label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Choose a strong password" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>State</label>
                <select name="state" value={form.state} onChange={handle} style={inputStyle}>
                  <option value="">Select state</option>
                  {indianStates.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>District</label>
                <input name="district" value={form.district} onChange={handle} placeholder="Your district" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
              </div>
            </div>
            {role === 'farmer' && (
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px', marginBottom: '14px', border: '1px solid #d1fae5' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', marginBottom: '10px' }}>👨‍🌾 Farmer details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Farm size (acres)</label>
                    <input value={farmerExtras.farmSize} onChange={e=>setFarmerExtras({...farmerExtras,farmSize:e.target.value})} placeholder="5" type="number" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Experience (years)</label>
                    <input value={farmerExtras.experience} onChange={e=>setFarmerExtras({...farmerExtras,experience:e.target.value})} placeholder="10" type="number" style={inputStyle} onFocus={e=>e.target.style.borderColor='#15803d'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
                  </div>
                </div>
              </div>
            )}
            {role === 'buyer' && (
              <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '14px', marginBottom: '14px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '10px' }}>🛒 Business details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Business name</label>
                    <input value={buyerExtras.businessName} onChange={e=>setBuyerExtras({...buyerExtras,businessName:e.target.value})} placeholder="Your business" style={inputStyle} onFocus={e=>e.target.style.borderColor='#1d4ed8'} onBlur={e=>e.target.style.borderColor='#d1d5db'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Business type</label>
                    <select value={buyerExtras.businessType} onChange={e=>setBuyerExtras({...buyerExtras,businessType:e.target.value})} style={inputStyle}>
                      {['retailer','wholesaler','processor','exporter','individual'].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : `Create ${role} account →`}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}