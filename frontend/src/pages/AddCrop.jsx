import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const indianStates = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function AddCrop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'vegetables', description: '', quantityAmount: '', quantityUnit: 'kg', priceAmount: '', pricePer: 'kg', state: '', district: '', quality: 'A', isOrganic: false });

  const handle = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quantityAmount || !form.priceAmount) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await API.post('/crops', {
        name: form.name, category: form.category, description: form.description,
        quantity: { amount: Number(form.quantityAmount), unit: form.quantityUnit },
        price: { amount: Number(form.priceAmount), per: form.pricePer },
        location: { state: form.state, district: form.district },
        quality: form.quality, isOrganic: form.isOrganic
      });
      toast.success('Crop listed successfully!');
      navigate('/farmer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add crop');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '28px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2e1a' }}>🌿 Add crop listing</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>List your crop for buyers across India</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #d1fae5' }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Crop name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. Red tomatoes" style={inputStyle} onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select name="category" value={form.category} onChange={handle} style={inputStyle}>
                  {['vegetables','fruits','grains','pulses','spices','oilseeds','cotton','sugarcane','other'].map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quality grade</label>
                <select name="quality" value={form.quality} onChange={handle} style={inputStyle}>
                  <option value="A">Grade A (Best)</option>
                  <option value="B">Grade B (Good)</option>
                  <option value="C">Grade C (Average)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Quantity *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input name="quantityAmount" type="number" value={form.quantityAmount} onChange={handle} placeholder="500" style={{ ...inputStyle, flex: 1 }} onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
                  <select name="quantityUnit" value={form.quantityUnit} onChange={handle} style={{ ...inputStyle, width: '90px' }}>
                    {['kg','quintal','ton','piece','dozen','bag'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Price *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input name="priceAmount" type="number" value={form.priceAmount} onChange={handle} placeholder="28" style={{ ...inputStyle, flex: 1 }} onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
                  <select name="pricePer" value={form.pricePer} onChange={handle} style={{ ...inputStyle, width: '90px' }}>
                    {['kg','quintal','ton','piece','dozen','bag'].map(u => <option key={u} value={u}>/{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>State</label>
                <select name="state" value={form.state} onChange={handle} style={inputStyle}>
                  <option value="">Select state</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>District</label>
                <input name="district" value={form.district} onChange={handle} placeholder="Your district" style={inputStyle} onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handle} placeholder="Describe your crop — freshness, harvest date, special features..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='#15803d'} onBlur={e => e.target.style.borderColor='#d1d5db'} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
              <input type="checkbox" name="isOrganic" checked={form.isOrganic} onChange={handle} style={{ width: '18px', height: '18px', accentColor: '#15803d' }} />
              🌱 This is organically grown produce
            </label>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Listing crop...' : '🌿 List my crop'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}