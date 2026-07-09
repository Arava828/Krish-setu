import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const categoryEmoji = { vegetables:'🥦',fruits:'🍎',grains:'🌾',pulses:'🫘',spices:'🌶️',oilseeds:'🌻',cotton:'🪴',sugarcane:'🎋',other:'🌿' };
const categoryBg = { vegetables:'#f0fdf4',fruits:'#fef9c3',grains:'#fef3c7',pulses:'#fdf2f8',spices:'#fff7ed',oilseeds:'#fffbeb',other:'#f9fafb' };
const categories = ['all','vegetables','fruits','grains','pulses','spices','oilseeds'];
const states = ['All states','Karnataka','Maharashtra','Haryana','Andhra Pradesh','Tamil Nadu','Punjab','Uttar Pradesh','Gujarat'];

export default function CropListing() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [state, setState] = useState('All states');
  const [search, setSearch] = useState('');
  const [organic, setOrganic] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (category !== 'all') params.append('category', category);
      if (state !== 'All states') params.append('state', state);
      if (search) params.append('search', search);
      if (organic) params.append('isOrganic', 'true');
      const res = await API.get(`/crops?${params}`);
      setCrops(res.data.crops || []);
      setPagination(res.data.pagination || {});
    } catch { setCrops([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCrops(); }, [category, state, organic, page]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'linear-gradient(135deg,#052e16,#15803d)', padding: '28px', color: '#fff' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>🌾 Browse fresh crops</h1>
        <p style={{ fontSize: '13px', color: '#bbf7d0', marginBottom: '16px' }}>Directly from verified farmers across India</p>
        <form onSubmit={(e)=>{e.preventDefault();fetchCrops();}} style={{ display: 'flex', gap: '10px', maxWidth: '560px' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tomatoes, wheat, mangoes..."
            style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
          <button type="submit" style={{ background: '#4ade80', color: '#052e16', padding: '11px 22px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>Search</button>
        </form>
      </div>

      <div style={{ padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={()=>{setCategory(cat);setPage(1);}}
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', background: category===cat ? '#15803d' : '#fff', color: category===cat ? '#fff' : '#6b7280', borderColor: category===cat ? '#15803d' : '#d1d5db' }}>
              {cat === 'all' ? '🌿 All' : cat}
            </button>
          ))}
          <select value={state} onChange={e=>{setState(e.target.value);setPage(1);}}
            style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid #d1d5db', fontSize: '13px', background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
            {states.map(s=><option key={s}>{s}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <input type="checkbox" checked={organic} onChange={e=>setOrganic(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#15803d' }} />
            🌱 Organic only
          </label>
          {pagination.total > 0 && <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: 'auto' }}>{pagination.total} crops found</span>}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #d1fae5', borderTop: '4px solid #15803d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : crops.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
              {crops.map(crop => (
                <Link key={crop._id} to={`/crops/${crop._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e5e7eb', transition: 'all .2s', cursor: 'pointer' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#4ade80';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 30px rgba(21,128,61,.12)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                    <div style={{ height: '90px', background: categoryBg[crop.category]||'#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', position: 'relative' }}>
                      {categoryEmoji[crop.category]||'🌿'}
                      {crop.isOrganic && <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#15803d', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>Organic</span>}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{crop.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '10px' }}>📍 {crop.location?.district}, {crop.location?.state}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#15803d' }}>₹{crop.price?.amount}/{crop.price?.per}</span>
                        <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '3px 8px', borderRadius: '6px' }}>{crop.quantity?.amount} {crop.quantity?.unit}</span>
                      </div>
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '22px', height: '22px', background: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{crop.farmer?.name?.charAt(0)}</div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{crop.farmer?.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding: '8px 16px', borderRadius: '9px', border: '1.5px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px', opacity: page===1?0.5:1 }}>← Prev</button>
                <button onClick={()=>setPage(p=>Math.min(pagination.pages,p+1))} disabled={page===pagination.pages} style={{ padding: '8px 16px', borderRadius: '9px', border: '1.5px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px', opacity: page===pagination.pages?0.5:1 }}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌾</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No crops found</div>
            <div style={{ fontSize: '14px' }}>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}