import { useState } from 'react';

const marketData = [
  { crop: 'Tomatoes', price: 28, change: +12, unit: 'kg', high: 35, low: 22, emoji: '🍅', color: '#ef4444' },
  { crop: 'Onions', price: 18, change: -5, unit: 'kg', high: 25, low: 15, emoji: '🧅', color: '#8b5cf6' },
  { crop: 'Potatoes', price: 22, change: +8, unit: 'kg', high: 28, low: 18, emoji: '🥔', color: '#f59e0b' },
  { crop: 'Rice (Basmati)', price: 4200, change: +3, unit: 'quintal', high: 4500, low: 3800, emoji: '🌾', color: '#15803d' },
  { crop: 'Wheat', price: 2800, change: -2, unit: 'quintal', high: 3000, low: 2600, emoji: '🌿', color: '#d97706' },
  { crop: 'Chilli', price: 180, change: +15, unit: 'kg', high: 200, low: 150, emoji: '🌶️', color: '#dc2626' },
  { crop: 'Turmeric', price: 120, change: +6, unit: 'kg', high: 140, low: 100, emoji: '🟡', color: '#ca8a04' },
  { crop: 'Garlic', price: 85, change: -8, unit: 'kg', high: 100, low: 70, emoji: '🧄', color: '#7c3aed' },
];

const news = [
  { title: 'Tomato prices surge 12% in southern markets due to unseasonal rains', time: '2 hours ago', tag: 'Price Alert', tagColor: '#ef4444', tagBg: '#fee2e2' },
  { title: 'Government announces MSP hike for Kharif crops — farmers to benefit', time: '5 hours ago', tag: 'Policy', tagColor: '#1d4ed8', tagBg: '#dbeafe' },
  { title: 'Onion exports rise 18% in June — demand from Middle East increases', time: '8 hours ago', tag: 'Export', tagColor: '#15803d', tagBg: '#dcfce7' },
  { title: 'IMD predicts normal monsoon — good news for farmers across India', time: '1 day ago', tag: 'Weather', tagColor: '#d97706', tagBg: '#fef9c3' },
  { title: 'Digital agriculture market to reach ₹70,000 Cr by 2025 in India', time: '1 day ago', tag: 'Market', tagColor: '#7c3aed', tagBg: '#f5f3ff' },
];

const weeklyTrend = [40, 55, 48, 62, 58, 72, 68];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxTrend = Math.max(...weeklyTrend);

export default function MarketTrends() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = marketData.filter(m =>
    m.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#052e16,#15803d)', padding: '28px', color: '#fff' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>📈 Market Trends</h1>
        <p style={{ fontSize: '13px', color: '#bbf7d0', marginBottom: '16px' }}>Live mandi prices and agricultural market insights</p>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crop prices..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>

        {/* Price ticker */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', border: '1.5px solid #e5e7eb', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.5px' }}>🔴 Live Mandi Prices</div>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
            {marketData.map((m, i) => (
              <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{m.emoji}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{m.crop}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>₹{m.price}/{m.unit}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: m.change > 0 ? '#15803d' : '#ef4444' }}>
                      {m.change > 0 ? '↑' : '↓'} {Math.abs(m.change)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Price table */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', fontWeight: 800, color: '#1a2e1a' }}>
              💰 Mandi Price List
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Crop', 'Price', 'Change', 'High', 'Low'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={i} onClick={() => setSelected(m)}
                    style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: selected?.crop === m.crop ? '#f0fdf4' : 'transparent', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = selected?.crop === m.crop ? '#f0fdf4' : 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{m.emoji}</span>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{m.crop}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#15803d' }}>₹{m.price}/{m.unit}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: m.change > 0 ? '#dcfce7' : '#fee2e2', color: m.change > 0 ? '#166534' : '#991b1b' }}>
                        {m.change > 0 ? '↑' : '↓'} {Math.abs(m.change)}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#15803d', fontWeight: 600 }}>₹{m.high}</td>
                    <td style={{ padding: '12px 16px', color: '#ef4444', fontWeight: 600 }}>₹{m.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weekly trend chart */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a2e1a', marginBottom: '6px' }}>📊 Weekly Trade Volume</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Total orders placed this week</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', marginBottom: '8px' }}>
              {weeklyTrend.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{val}</div>
                  <div style={{ width: '100%', background: i === 5 ? 'linear-gradient(180deg,#15803d,#4ade80)' : '#d1fae5', borderRadius: '6px 6px 0 0', height: `${(val / maxTrend) * 120}px`, minHeight: '10px' }} />
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{days[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#15803d', fontWeight: 600, marginTop: '8px' }}>
              📈 Saturday had highest trading volume this week!
            </div>

            {/* Selected crop detail */}
            {selected && (
              <div style={{ marginTop: '12px', background: '#f9fafb', borderRadius: '10px', padding: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{selected.emoji} {selected.crop}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div style={{ color: '#6b7280' }}>Current: <span style={{ fontWeight: 700, color: '#15803d' }}>₹{selected.price}/{selected.unit}</span></div>
                  <div style={{ color: '#6b7280' }}>Change: <span style={{ fontWeight: 700, color: selected.change > 0 ? '#15803d' : '#ef4444' }}>{selected.change > 0 ? '+' : ''}{selected.change}%</span></div>
                  <div style={{ color: '#6b7280' }}>High: <span style={{ fontWeight: 700, color: '#15803d' }}>₹{selected.high}</span></div>
                  <div style={{ color: '#6b7280' }}>Low: <span style={{ fontWeight: 700, color: '#ef4444' }}>₹{selected.low}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agricultural News */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', fontWeight: 800, color: '#1a2e1a' }}>
            📰 Agricultural News & Updates
          </div>
          {news.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 20px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📰</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px', lineHeight: 1.4 }}>{n.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: n.tagBg, color: n.tagColor }}>{n.tag}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>🕐 {n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}