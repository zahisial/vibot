import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import { Footer, AssetIcon, Skeleton } from '../components/shared'
import { useLivePrices, useRevenueChart } from '../api/useCrypto'

const growthData = [
  { q: 'Q1', y: 2022, u: 1200 }, { q: 'Q2', y: 2022, u: 2100 }, { q: 'Q3', y: 2022, u: 1800 }, { q: 'Q4', y: 2022, u: 3200 },
  { q: 'Q1', y: 2023, u: 4000 }, { q: 'Q2', y: 2023, u: 5500 }, { q: 'Q3', y: 2023, u: 7200 }, { q: 'Q4', y: 2023, u: 9800 },
  { q: 'Q1', y: 2024, u: 11000 }, { q: 'Q2', y: 2024, u: 13500 }, { q: 'Q3', y: 2024, u: 16800 }, { q: 'Q4', y: 2024, u: 20000 },
]

export default function DashboardPage() {
  const [chartRange, setChartRange] = useState('Weekly')
  const { prices, loading, lastUpdated } = useLivePrices()
  const revenueData = useRevenueChart(chartRange)

  const arbBreakdown = [
    { t: 'ETH', v: '611.85', color: '#627eea', icon: 'Ξ' },
    { t: 'KRW', v: '546,013,875', color: '#2d9cdb', icon: '₩' },
    { t: 'USDT', v: '411,406.08', color: '#26a17b', icon: '₮' },
  ]
  const metrics = [
    { l: 'Total Market Cap', v: '2.34M', icon: '📈' },
    { l: 'TVL', v: '17.01M', icon: '🔒' },
    { l: 'Total Holders', v: '3,400', icon: '👥' },
    { l: '24H Volume', v: '314.74K', icon: '💹' },
  ]

  return (
    <main className="page-wrap">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
        {lastUpdated && (
          <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            Live · {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Row 1 — 2+1+1 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Total Operating Assets */}
        <div className="card animate-fade-up">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Total Operating Assets</div>
          {loading ? <Skeleton height={32} style={{ marginBottom: 16 }} /> : (
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em' }}>
              1,618,801.89 USD
            </div>
          )}
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12, fontWeight: 500 }}>Arbitrage Assets Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {arbBreakdown.map(a => (
              <div key={a.t} style={{ background: a.color + '18', border: `1px solid ${a.color}33`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>{a.icon}</div>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a.t}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{a.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Data */}
        <div className="card animate-fade-up-1">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Revenue Data</div>
          <div className="card-inner" style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Profit</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800 }}>$2,079</div>
            <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>↑ +24.3% this week</div>
          </div>
          <div className="card-inner">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Yield</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800 }}>0.1285%</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Daily avg</div>
          </div>
        </div>

        {/* Right metric cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {metrics.map((m, i) => (
            <div key={m.l} className={`stat-card animate-fade-up-${i % 4}`}>
              <div>
                <div className="stat-label">{m.l}</div>
                <div className="stat-value" style={{ fontSize: 17 }}>{m.v}</div>
              </div>
              <div className="stat-icon">{m.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, marginBottom: 16 }}>
        <div className="card chart-card">
          <div className="chart-header">
            <div className="chart-title">User participation growth chart</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={growthData} margin={{ top: 0, bottom: 0, left: -20, right: 0 }}>
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1735', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="u" fill="#6d4eff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <div className="chart-title">Revenue Chart</div>
            <div className="time-toggle">
              {['Weekly', 'Monthly', 'Yearly'].map(r => (
                <button key={r} className={`time-btn ${r === chartRange ? 'active' : ''}`} onClick={() => setChartRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 10, bottom: 0, left: -20, right: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6d4eff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6d4eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1735', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }}
                formatter={v => ['$' + v.toLocaleString(), 'Revenue']}
              />
              <Area type="monotone" dataKey="v" stroke="#6d4eff" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 — Bottom charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 16 }}>
        {/* Token burn donut */}
        <div className="card chart-card">
          <div className="chart-title" style={{ marginBottom: 12 }}>Token Burn vs Circulated Supply</div>
          <div style={{ position: 'relative', height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={[{ v: 1252073 }, { v: 675152272 }]} dataKey="v" cx="50%" cy="50%" innerRadius={52} outerRadius={76} startAngle={90} endAngle={-270}>
                  <Cell fill="#6d4eff" />
                  <Cell fill="#2a2555" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Circulating</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>675.1M</div>
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', marginTop: 4 }}>
            Total Burned: <span style={{ color: 'var(--text2)' }}>1,252,073</span>
          </div>
        </div>

        {/* TVL */}
        <div className="card chart-card">
          <div className="chart-title" style={{ marginBottom: 12 }}>TVL Historic Chart</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData.map(d => ({ ...d, tvl: d.u * 850 }))} margin={{ top: 10, bottom: 0, left: -20, right: 0 }}>
              <defs>
                <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1735', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }} formatter={v => ['$' + v.toLocaleString(), 'TVL']} />
              <Area type="monotone" dataKey="tvl" stroke="#22c55e" strokeWidth={2} fill="url(#tvlGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compound Interest Sim */}
        <div className="card chart-card">
          <div className="chart-title" style={{ marginBottom: 12 }}>Compound Interest Simulation</div>
          <div style={{ marginBottom: 12 }}>
            <input type="range" min={1000} max={50000} step={500} defaultValue={10000}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              <span>$1k</span><span>$50k</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, i) => ({
              m: `M${m}`, v: 10000 * Math.pow(1.1, i)
            }))} margin={{ top: 0, bottom: 0, left: -20, right: 0 }}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} fill="url(#compGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
            Projected 12-month return
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <Footer />
      </div>
    </main>
  )
}
