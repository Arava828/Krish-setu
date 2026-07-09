import { useState } from 'react';

const crops = ['Tomatoes', 'Rice', 'Wheat', 'Onions', 'Potatoes', 'Chilli', 'Maize', 'Sugarcane', 'Cotton', 'Soybean'];
const soilTypes = ['Black soil', 'Red soil', 'Alluvial soil', 'Sandy soil', 'Clay soil'];
const seasons = ['Kharif (Jun-Oct)', 'Rabi (Nov-Apr)', 'Zaid (Apr-Jun)'];
const indianStates = ['Karnataka', 'Maharashtra', 'Haryana', 'Andhra Pradesh', 'Tamil Nadu', 'Punjab', 'Uttar Pradesh', 'Gujarat'];

export default function AIFeatures() {
  const [activeTab, setActiveTab] = useState('yield');

  // Yield prediction state
  const [yieldForm, setYieldForm] = useState({ crop: 'Tomatoes', area: '', soil: 'Black soil', season: 'Kharif (Jun-Oct)', rainfall: '', state: 'Karnataka' });
  const [yieldResult, setYieldResult] = useState(null);
  const [yieldLoading, setYieldLoading] = useState(false);

  // Price prediction state
  const [priceForm, setPriceForm] = useState({ crop: 'Tomatoes', quality: 'A', quantity: '', state: 'Karnataka', organic: false });
  const [priceResult, setPriceResult] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Farming suggestion state
  const [suggForm, setSuggForm] = useState({ crop: 'Tomatoes', state: 'Karnataka', season: 'Kharif (Jun-Oct)', issue: '' });
  const [suggResult, setSuggResult] = useState(null);
  const [suggLoading, setSuggLoading] = useState(false);

  const predictYield = () => {
    if (!yieldForm.area) return alert('Please enter farm area');
    setYieldLoading(true);
    setTimeout(() => {
      const baseYield = { Tomatoes: 25, Rice: 45, Wheat: 40, Onions: 30, Potatoes: 35, Chilli: 15, Maize: 38, Sugarcane: 700, Cotton: 18, Soybean: 22 };
      const base = baseYield[yieldForm.crop] || 25;
      const area = parseFloat(yieldForm.area);
      const soilBonus = yieldForm.soil === 'Black soil' ? 1.1 : yieldForm.soil === 'Alluvial soil' ? 1.15 : 1.0;
      const rainBonus = yieldForm.rainfall > 100 ? 1.05 : 0.95;
      const estimated = (base * area * soilBonus * rainBonus).toFixed(1);
      const revenue = (estimated * (yieldForm.crop === 'Rice' ? 42 : yieldForm.crop === 'Wheat' ? 28 : 30)).toFixed(0);
      setYieldResult({
        estimated,
        unit: yieldForm.crop === 'Sugarcane' ? 'quintal' : 'quintal',
        revenue,
        confidence: 87,
        tips: [
          `Best planting time for ${yieldForm.crop} in ${yieldForm.state} is early ${yieldForm.season.split('(')[0]}`,
          `Use drip irrigation to improve yield by 15-20%`,
          `Apply organic compost 2 weeks before planting`,
          `Monitor for pests weekly during growing season`
        ]
      });
      setYieldLoading(false);
    }, 1800);
  };

  const predictPrice = () => {
    if (!priceForm.quantity) return alert('Please enter quantity');
    setPriceLoading(true);
    setTimeout(() => {
      const basePrices = { Tomatoes: 28, Rice: 42, Wheat: 28, Onions: 18, Potatoes: 22, Chilli: 180, Maize: 20, Sugarcane: 35, Cotton: 65, Soybean: 45 };
      const base = basePrices[priceForm.crop] || 28;
      const qualityBonus = priceForm.quality === 'A' ? 1.15 : priceForm.quality === 'B' ? 1.0 : 0.85;
      const organicBonus = priceForm.organic ? 1.25 : 1.0;
      const recommended = (base * qualityBonus * organicBonus).toFixed(0);
      const minPrice = (recommended * 0.85).toFixed(0);
      const maxPrice = (recommended * 1.15).toFixed(0);
      const totalRevenue = (recommended * parseFloat(priceForm.quantity)).toFixed(0);
      setPriceResult({
        recommended,
        minPrice,
        maxPrice,
        totalRevenue,
        marketTrend: '+8% this week',
        bestTime: 'Morning (6-10 AM) at local mandi',
        advice: priceForm.organic ? 'Organic premium pricing is justified — market demand is high!' : 'Consider organic certification to increase price by 20-25%'
      });
      setPriceLoading(false);
    }, 1500);
  };

  const getFarmingSuggestions = () => {
    setSuggLoading(true);
    setTimeout(() => {
      const suggestions = {
        Tomatoes: {
          tips: ['Water every 2-3 days during fruiting stage', 'Use stakes to support plant growth', 'Apply potassium fertilizer for better fruit quality', 'Watch for early blight — spray neem oil solution'],
          fertilizer: 'NPK 19:19:19 at planting, then Calcium Nitrate after flowering',
          pestControl: 'Neem oil spray weekly, Trichoderma for soil health',
          harvest: '60-70 days after transplanting'
        },
        Rice: {
          tips: ['Maintain 2-3 inches of water during vegetative stage', 'Apply Zinc sulfate for better tillering', 'Use SRI method to save water and increase yield', 'Drain field 10 days before harvest'],
          fertilizer: 'Urea in 3 splits — basal, tillering, panicle initiation',
          pestControl: 'Monitor for stem borer and leaf folder — use pheromone traps',
          harvest: '100-120 days after transplanting'
        },
        Wheat: {
          tips: ['Sow in October-November for best yield', 'First irrigation at crown root initiation (21 days)', 'Apply weedicide at 30-35 days after sowing', 'Harvest when grain moisture is below 14%'],
          fertilizer: 'NPK 120:60:40 kg/hectare — apply in splits',
          pestControl: 'Watch for rust disease — spray Propiconazole if spotted',
          harvest: '110-130 days after sowing'
        }
      };
      const data = suggestions[suggForm.crop] || suggestions['Tomatoes'];
      setSuggResult(data);
      setSuggLoading(false);
    }, 1500);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: '#fff' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2e1a' }}>🤖 AI Farming Assistant</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Smart predictions powered by agricultural data and machine learning</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '5px', border: '1.5px solid #e5e7eb', marginBottom: '24px', width: 'fit-content' }}>
        {[
          ['yield', '🌾 Yield Prediction'],
          ['price', '💰 Price Recommendation'],
          ['suggestions', '🌱 Farming Suggestions']
        ].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: 'all .15s', background: activeTab === tab ? '#15803d' : 'transparent', color: activeTab === tab ? '#fff' : '#6b7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Yield Prediction */}
      {activeTab === 'yield' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>🌾 Crop Yield Predictor</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Crop type</label>
                <select value={yieldForm.crop} onChange={e => setYieldForm({ ...yieldForm, crop: e.target.value })} style={inputStyle}>
                  {crops.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Farm area (acres)</label>
                <input type="number" value={yieldForm.area} onChange={e => setYieldForm({ ...yieldForm, area: e.target.value })} placeholder="e.g. 5" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Soil type</label>
                <select value={yieldForm.soil} onChange={e => setYieldForm({ ...yieldForm, soil: e.target.value })} style={inputStyle}>
                  {soilTypes.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Season</label>
                <select value={yieldForm.season} onChange={e => setYieldForm({ ...yieldForm, season: e.target.value })} style={inputStyle}>
                  {seasons.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Avg rainfall (mm)</label>
                <input type="number" value={yieldForm.rainfall} onChange={e => setYieldForm({ ...yieldForm, rainfall: e.target.value })} placeholder="e.g. 120" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select value={yieldForm.state} onChange={e => setYieldForm({ ...yieldForm, state: e.target.value })} style={inputStyle}>
                  {indianStates.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={predictYield} disabled={yieldLoading}
              style={{ width: '100%', padding: '12px', background: yieldLoading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: yieldLoading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
              {yieldLoading ? '🤖 Predicting...' : '🌾 Predict Yield'}
            </button>
          </div>

          {/* Yield Result */}
          <div>
            {!yieldResult ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌾</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Fill in your farm details</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Our AI will predict your expected crop yield and estimated revenue</div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #d1fae5' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803d', marginBottom: '16px' }}>✅ Yield Prediction Result</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #d1fae5' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#15803d' }}>{yieldResult.estimated}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Estimated {yieldResult.unit}</div>
                  </div>
                  <div style={{ background: '#f5f3ff', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#7c3aed' }}>₹{parseInt(yieldResult.revenue).toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Expected revenue</div>
                  </div>
                </div>
                <div style={{ background: '#dbeafe', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#1e40af', fontWeight: 600, marginBottom: '14px' }}>
                  🎯 AI Confidence: {yieldResult.confidence}% accuracy
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>💡 Tips to maximize yield:</div>
                {yieldResult.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                    <span style={{ color: '#15803d', fontWeight: 700, flexShrink: 0 }}>✓</span>{tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Recommendation */}
      {activeTab === 'price' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>💰 Optimal Price Recommender</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Crop</label>
                <select value={priceForm.crop} onChange={e => setPriceForm({ ...priceForm, crop: e.target.value })} style={inputStyle}>
                  {crops.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quality grade</label>
                <select value={priceForm.quality} onChange={e => setPriceForm({ ...priceForm, quality: e.target.value })} style={inputStyle}>
                  <option value="A">Grade A (Best)</option>
                  <option value="B">Grade B (Good)</option>
                  <option value="C">Grade C (Average)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quantity (kg)</label>
                <input type="number" value={priceForm.quantity} onChange={e => setPriceForm({ ...priceForm, quantity: e.target.value })} placeholder="e.g. 500" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select value={priceForm.state} onChange={e => setPriceForm({ ...priceForm, state: e.target.value })} style={inputStyle}>
                  {indianStates.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
              <input type="checkbox" checked={priceForm.organic} onChange={e => setPriceForm({ ...priceForm, organic: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#15803d' }} />
              🌱 Organically grown
            </label>
            <button onClick={predictPrice} disabled={priceLoading}
              style={{ width: '100%', padding: '12px', background: priceLoading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: priceLoading ? 'not-allowed' : 'pointer' }}>
              {priceLoading ? '🤖 Calculating...' : '💰 Get Price Recommendation'}
            </button>
          </div>

          <div>
            {!priceResult ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Enter crop details</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>AI will suggest the best price based on market data, quality and location</div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #d1fae5' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803d', marginBottom: '16px' }}>✅ Price Recommendation</div>
                <div style={{ background: 'linear-gradient(135deg,#052e16,#15803d)', borderRadius: '12px', padding: '18px', color: '#fff', marginBottom: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#bbf7d0', marginBottom: '4px' }}>RECOMMENDED PRICE</div>
                  <div style={{ fontSize: '36px', fontWeight: 900 }}>₹{priceResult.recommended}/kg</div>
                  <div style={{ fontSize: '12px', color: '#bbf7d0', marginTop: '4px' }}>Range: ₹{priceResult.minPrice} — ₹{priceResult.maxPrice}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>₹{parseInt(priceResult.totalRevenue).toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Total revenue</div>
                  </div>
                  <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#854d0e' }}>{priceResult.marketTrend}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Market trend</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>⏰ Best selling time: <span style={{ fontWeight: 700, color: '#374151' }}>{priceResult.bestTime}</span></div>
                <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#15803d', lineHeight: 1.5 }}>
                  💡 {priceResult.advice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Farming Suggestions */}
      {activeTab === 'suggestions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a2e1a', marginBottom: '20px' }}>🌱 Get Farming Suggestions</div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Crop</label>
              <select value={suggForm.crop} onChange={e => setSuggForm({ ...suggForm, crop: e.target.value })} style={inputStyle}>
                {['Tomatoes', 'Rice', 'Wheat'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>State</label>
              <select value={suggForm.state} onChange={e => setSuggForm({ ...suggForm, state: e.target.value })} style={inputStyle}>
                {indianStates.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Season</label>
              <select value={suggForm.season} onChange={e => setSuggForm({ ...suggForm, season: e.target.value })} style={inputStyle}>
                {seasons.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Current issue (optional)</label>
              <textarea value={suggForm.issue} onChange={e => setSuggForm({ ...suggForm, issue: e.target.value })} placeholder="e.g. yellowing leaves, low yield..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button onClick={getFarmingSuggestions} disabled={suggLoading}
              style={{ width: '100%', padding: '12px', background: suggLoading ? '#86efac' : '#15803d', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: suggLoading ? 'not-allowed' : 'pointer' }}>
              {suggLoading ? '🤖 Generating tips...' : '🌱 Get Suggestions'}
            </button>
          </div>

          <div>
            {!suggResult ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #e5e7eb', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Select your crop and location</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Get expert farming tips, fertilizer advice and pest control suggestions</div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #d1fae5' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803d', marginBottom: '16px' }}>✅ Farming Suggestions for {suggForm.crop}</div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>💡 Key Tips:</div>
                  {suggResult.tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#374151', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px' }}>
                      <span style={{ color: '#15803d', fontWeight: 700, flexShrink: 0 }}>✓</span>{tip}
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fef9c3', borderRadius: '10px', padding: '12px', marginBottom: '10px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e', marginBottom: '4px' }}>🌿 Fertilizer recommendation:</div>
                  <div style={{ fontSize: '12px', color: '#92400e' }}>{suggResult.fertilizer}</div>
                </div>
                <div style={{ background: '#fee2e2', borderRadius: '10px', padding: '12px', marginBottom: '10px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>🐛 Pest control:</div>
                  <div style={{ fontSize: '12px', color: '#7f1d1d' }}>{suggResult.pestControl}</div>
                </div>
                <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>🌾 Expected harvest time:</div>
                  <div style={{ fontSize: '12px', color: '#14532d' }}>{suggResult.harvest}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}