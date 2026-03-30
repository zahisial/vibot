import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Footer } from '../components/shared'
import { useLivePrices } from '../api/useCrypto'

const howItems = [
  { icon: '⚡', title: 'Arbitrage Excellence', desc: 'Leveraging price differences across multiple exchanges simultaneously for consistent, low-risk returns impossible to achieve manually.' },
  { icon: '🌐', title: 'Global Integration', desc: 'Seamlessly connected to Binance, Upbit, Kraken and 12 other major exchanges worldwide for maximum opportunity capture.' },
  { icon: '🛡️', title: 'Stable Asset Management', desc: 'ViBoT prioritizes stability by maintaining an equal balance of ETH and USDT on both exchanges. This equilibrium ensures stability and facilitates instant execution of buy and sell orders, a key factor in ViBoT\'s success.' },
  { icon: '📊', title: 'Adaptive to Market Dynamics', desc: 'Real-time machine learning models continuously adapt trading parameters to current volatility conditions.' },
  { icon: '⚖️', title: 'Efficient Risk Mitigation', desc: 'Multi-layered stop-loss systems and position sizing algorithms protect your capital in all market conditions.' },
]

const RATES = {
  ETH:  { '1 Month': 10.0346, '3 Months': 32.1, '1 Year': 143.2 },
  BTC:  { '1 Month': 9.52,    '3 Months': 29.8, '1 Year': 138.4 },
  USDT: { '1 Month': 8.20,    '3 Months': 25.1, '1 Year': 112.0 },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { prices } = useLivePrices()
  const [token, setToken]   = useState('ETH')
  const [amount, setAmount] = useState('1000')
  const [period, setPeriod] = useState('1 Month')
  const [activeHow, setActiveHow] = useState(2)

  const rate    = RATES[token]?.[period] ?? 10
  const invest  = parseFloat(amount) || 0
  const profit  = invest * (rate / 100)
  const total   = invest + profit

  const chartData = [
    { m: 'Jan', v: 1200 }, { m: 'Feb', v: 1450 }, { m: 'Mar', v: 1320 },
    { m: 'Apr', v: 1680 }, { m: 'May', v: 1540 }, { m: 'Jun', v: 1920 },
    { m: 'Jul', v: 2100 }, { m: 'Aug', v: 1980 }, { m: 'Sep', v: 2340 },
    { m: 'Oct', v: 2560 }, { m: 'Nov', v: 2820 }, { m: 'Dec', v: 3100 },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Orbs */}
        <div className="hero-orb" style={{ width: 190, height: 190, background: 'radial-gradient(circle, rgba(247,183,49,0.45), transparent)', top: '10%', left: '6%', animationDelay: '0s' }} />
        <div className="hero-orb" style={{ width: 140, height: 140, background: 'radial-gradient(circle, rgba(55,203,145,0.45), transparent)', top: '8%', right: '10%', animationDelay: '2s' }} />
        <div className="hero-orb" style={{ width: 90, height: 90, background: 'radial-gradient(circle, rgba(109,78,255,0.6), transparent)', bottom: '18%', left: '12%', animationDelay: '1s' }} />
        <div className="hero-orb" style={{ width: 70, height: 70, background: 'radial-gradient(circle, rgba(55,203,145,0.35), transparent)', bottom: '22%', right: '8%', animationDelay: '3s' }} />

        <h1 className="section-title animate-fade-up" style={{ fontSize: 'clamp(36px, 6vw, 62px)', marginBottom: 16 }}>
          Invest with <span style={{ color: 'var(--accent2)' }}>ViBoT!</span>
        </h1>
        <p className="section-sub animate-fade-up-1" style={{ maxWidth: 520, margin: '0 auto 28px' }}>
          Join Over <strong style={{ color: 'var(--text)' }}>3000</strong> People who trusted our ViBoT's winning arbitrage system since 2020 with no loss. Compound interest rates 10 times better than any bank in the world!
        </p>

        <div className="animate-fade-up-2" style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Trusted by 50k+ users</div>
          <div style={{ fontSize: 15 }}>⭐⭐⭐⭐☆ <span style={{ fontSize: 13, color: 'var(--muted)' }}>4.1/5 (14k Reviews)</span></div>
        </div>

        {/* Invest Calculator Card */}
        <div className="invest-card animate-fade-up-3" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Choose Token</label>
              <select className="inp" value={token} onChange={e => setToken(e.target.value)}>
                <option>ETH</option><option>BTC</option><option>USDT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount of Investment</label>
              <div style={{ position: 'relative' }}>
                <input className="inp" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingRight: 50 }} />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 13 }}>{token}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subscription Period</label>
              <select className="inp" value={period} onChange={e => setPeriod(e.target.value)}>
                <option>1 Month</option><option>3 Months</option><option>1 Year</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-md)', padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Expected Return</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Investment + Profits</span>
            </div>
            <div className="invest-return">{total.toFixed(4)} USDT</div>
            <div style={{ fontSize: 12, color: 'var(--green)' }}>✓ +{profit.toFixed(4)} profit ({rate}% APY)</div>
          </div>

          <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/invest')}>
            Invest Now
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
            {[['$1.62B+', 'Assets managed'], ['50k+', 'Happy users'], ['0', 'Loss since 2020']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ViBoT Section ───────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #0e0b26 0%, var(--bg) 100%)', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 56 }}>
          <div className="animate-fade-up">
            <h2 className="section-title">Unlock Your Passive Income Potential with ViBoT!</h2>
            <p className="section-sub" style={{ marginBottom: 28 }}>
              Welcome to ViBoT, Your gateway to hassle-free crypto trading! Our sophisticated trading bot is designed to generate consistent profits for you.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Explore Dashboard</button>
          </div>

          {/* Bot graphic */}
          <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle at center, var(--bg3), var(--bg))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div className="bot-core">
              <div style={{ fontSize: 34 }}>🤖</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent2)', letterSpacing: '0.12em' }}>#VIBOT</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { v: '1,324,847,729 ViCA', k: 'ViCA Burned' },
              { v: '30,000.00 ViCA', k: 'Staked ViCA' },
              { v: '21,604,872.672 USD', k: 'Market Cap' },
              { v: '675,152,272 ViCA', k: 'Tradable Circulating Supply' },
            ].map(s => (
              <div key={s.k} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 20px', transition: 'border-color var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700 }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #150e3e 0%, #1c1148 100%)', padding: '72px 24px', textAlign: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(109,78,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 className="section-title" style={{ position: 'relative', marginBottom: 32 }}>
          The future of your<br />financial growth starts here
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/invest')}>Invest Now</button>
          <button className="btn btn-outline btn-lg">Let's Talk</button>
        </div>
      </section>

      {/* ── How ViBoT Works ─────────────────────────────────── */}
      <section style={{ padding: '88px 24px', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="section-title">How ViBoT<br />works to maximise your funds</h2>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {howItems.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: i === activeHow ? 'var(--card)' : 'transparent',
                  border: `1px solid ${i === activeHow ? 'var(--border2)' : 'transparent'}`,
                  transition: 'all var(--transition)',
                }}
                onClick={() => setActiveHow(i)}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {h.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: i === activeHow ? 'var(--text)' : 'var(--muted)', marginBottom: 4 }}>{h.title}</div>
                  {i === activeHow && <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{h.desc}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Diagram */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['📤', '📥'].map((e, i) => (
                <div key={i} style={{ width: 100, height: 100, background: 'linear-gradient(135deg, var(--card2), var(--bg3))', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{e}</div>
              ))}
            </div>
            <div className="bot-core" style={{ width: 120, height: 120 }}>
              <div style={{ fontSize: 30 }}>🤖</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent2)', letterSpacing: '0.1em' }}>#VIBOT</div>
            </div>
            <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg, var(--card2), var(--bg3))', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>👥</div>
          </div>
        </div>
      </section>

      {/* ── Perf Chart ──────────────────────────────────────── */}
      <section style={{ padding: '0 24px 88px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="card">
            <div className="chart-header">
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700 }}>Platform Performance</h3>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Total user profits distributed (USD)</div>
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>+312% YTD</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6d4eff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6d4eff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1735', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }}
                  formatter={v => [`$${v.toLocaleString()}`, 'Profits']}
                />
                <Area type="monotone" dataKey="v" stroke="#6d4eff" strokeWidth={2.5} fill="url(#perfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
