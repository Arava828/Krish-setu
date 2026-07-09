import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function Home() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsRes, weatherRes] = await Promise.all([
          API.get('/crops?limit=6'),
          API.get('/weather?city=Delhi')
        ]);
        setCrops(cropsRes.data.crops || []);
        setWeather(weatherRes.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const demoCrops = [
    { name: 'Alphonso mangoes', emoji: '🥭', bg: '#fef9c3', price: '₹120/kg', qty: '200 kg', loc: 'Ratnagiri, MH', organic: true },
    { name: 'Red tomatoes', emoji: '🍅', bg: '#fce7f3', price: '₹28/kg', qty: '500 kg', loc: 'Kolar, KA', organic: false },
    { name: 'Basmati rice', emoji: '🌾', bg: '#fef3c7', price: '₹4,200/q', qty: '50 quintal', loc: 'Karnal, HR', organic: true },
    { name: 'Fresh coconuts', emoji: '🥥', bg: '#ecfdf5', price: '₹22/pc', qty: '300 pcs', loc: 'Mandya, KA', organic: false },
    { name: 'Guntur chilli', emoji: '🌶️', bg: '#fff7ed', price: '₹180/kg', qty: '80 kg', loc: 'Guntur, AP', organic: false },
    { name: 'Red onions', emoji: '🧅', bg: '#f5f3ff', price: '₹18/kg', qty: '1 ton', loc: 'Nashik, MH', organic: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Top ribbon — tricolor accent for a national feel, without using official govt emblems */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg,#FF9933 0%,#FF9933 33%,#ffffff 33%,#ffffff 66%,#138808 66%,#138808 100%)' }} />

      {/* Hero with background photo */}
      <div style={{
        position: 'relative',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(5,46,22,.92), rgba(21,128,61,.82)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '48px 28px'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)', color: '#fde68a', padding: '6px 18px', borderRadius: '24px', fontSize: '13px', fontWeight: 700, marginBottom: '22px', letterSpacing: '.3px' }}>
            🇮🇳 Trusted by 1,260+ farmers across 18 states
          </div>
          <h1 style={{ fontSize: '46px', fontWeight: 900, lineHeight: 1.12, marginBottom: '16px', letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,.25)' }}>
            Krishi Setu
          </h1>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#bbf7d0', marginBottom: '18px' }}>
            — A Bridge to Market —
          </div>
          <p style={{ fontSize: '16px', color: '#e2f5e9', lineHeight: 1.7, marginBottom: '34px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Connecting farmers directly with buyers across India. Fair prices, zero middlemen, and AI-backed market insight — built for the growth of Indian agriculture.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: '#4ade80', color: '#052e16', padding: '14px 30px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(74,222,128,.35)' }}>
              👨‍🌾 I'm a farmer — start selling
            </Link>
            <Link to="/crops" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', padding: '14px 30px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
              🛒 Browse fresh produce
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#fff', borderBottom: '1.5px solid #d1fae5', boxShadow: '0 4px 20px rgba(0,0,0,.04)' }}>
        {[['2,840','Active listings','🌾'],['1,260','Farmers onboard','👨‍🌾'],['18 states','Across India','📍'],['₹4.2Cr','Trade volume','💰']].map(([num,label,icon]) => (
          <div key={label} style={{ padding: '22px', textAlign: 'center', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#15803d' }}>{num}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Fresh listings */}
      <div style={{ padding: '44px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2e1a', marginBottom: '4px' }}>🛒 Fresh listings</h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Directly from verified farmers across India</p>
          </div>
          <Link to="/crops" style={{ background: '#f0fdf4', color: '#15803d', padding: '9px 18px', borderRadius: '9px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', border: '1.5px solid #d1fae5' }}>
            See all crops →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }}>
          {(crops.length > 0 ? crops : demoCrops).map((crop, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #e5e7eb', transition: 'all .25s', cursor: 'pointer' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#4ade80';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 14px 34px rgba(21,128,61,.14)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
              <div style={{ height: '100px', background: crop.bg || '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', position: 'relative' }}>
                {crop.emoji || '🌿'}
                {crop.isOrganic || crop.organic ? <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#15803d', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>Organic</span> : null}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{crop.name}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>📍 {crop.loc || `${crop.location?.district}, ${crop.location?.state}`}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#15803d' }}>{crop.price || `₹${crop.price?.amount}/${crop.price?.per}`}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '4px 9px', borderRadius: '6px' }}>{crop.qty || `${crop.quantity?.amount} ${crop.quantity?.unit}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature strip with photo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', borderTop: '1.5px solid #d1fae5', borderBottom: '1.5px solid #d1fae5' }}>
        <div style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '360px'
        }} />
        <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>Why farmers love Krishi Setu</h2>
          {[
            { icon:'🚜', title:'Direct from farmers', desc:'Buy fresh produce straight from the source. No middlemen, no markups.' },
            { icon:'🤖', title:'AI price insights', desc:'Get smart price recommendations powered by real market data.' },
            { icon:'🌤️', title:'Weather alerts', desc:'Hyperlocal weather forecasts with farming tips for your region.' },
            { icon:'📦', title:'Order tracking', desc:'Real-time order status updates from farm to your doorstep.' },
          ].map((f,i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', flexShrink: 0, background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <div style={{ margin: '32px 28px', background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', borderRadius: '18px', padding: '22px 26px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '40px' }}>🌤️</span>
            <div>
              <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600, marginBottom: '3px' }}>Today · {weather.city}</div>
              <div style={{ fontSize: '26px', fontWeight: 800 }}>{weather.temperature}°C</div>
              <div style={{ fontSize: '13px', color: '#bfdbfe', textTransform: 'capitalize' }}>{weather.description}</div>
            </div>
            <div style={{ marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,.15)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '12px', color: '#93c5fd' }}>💧 {weather.humidity}% &nbsp; 💨 {weather.windSpeed} km/h</div>
              <div style={{ fontSize: '12px', color: '#bfdbfe', marginTop: '6px', maxWidth: '340px', lineHeight: 1.5 }}>{weather.farmingTip}</div>
            </div>
          </div>
          <Link to="/crops" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>View all crops →</Link>
        </div>
      )}

      {/* CTA */}
      <div style={{
        margin: '0 28px 40px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        color: '#fff',
        backgroundImage: `linear-gradient(135deg, rgba(5,46,22,.9), rgba(21,128,61,.85)), url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '50px 32px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '10px' }}>Ready to grow your farm income?</h2>
        <p style={{ fontSize: '14px', color: '#bbf7d0', marginBottom: '26px' }}>Join 1,260+ farmers already selling on Krishi Setu</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ background: '#4ade80', color: '#052e16', padding: '13px 30px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>Register as farmer</Link>
          <Link to="/register" style={{ background: 'transparent', color: '#fff', padding: '13px 30px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>Register as buyer</Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#052e16', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '17px' }}>🌾 Krishi Setu</div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>© 2026 · A Bridge to Market · Built for Indian farmers</div>
        <div style={{ display: 'flex', gap: '18px', fontSize: '12px', color: '#9ca3af' }}>
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
      </div>
    </div>
  );
}
