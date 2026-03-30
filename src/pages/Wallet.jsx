import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Footer, AssetIcon, StatusBadge, PriceChange } from '../components/shared'
import { useLivePrices } from '../api/useCrypto'

/* ── Shared Data ──────────────────────────────────────────── */
const ASSETS = [
  { name: 'Bitcoin',     ticker: 'BTC', rate: '1 BTC = 41,940 USD', amount: '0.71632 BTC', usd: 30537.15 },
  { name: 'Ethereum',    ticker: 'ETH', rate: '1 ETH = 2,540 USD',  amount: '1.2 ETH',     usd: 3053.46 },
  { name: 'Tether USDt', ticker: 'USDT',rate: '1 USDT = 1.00 USD',  amount: '123 USDT',    usd: 123.00 },
  { name: 'ViCA',        ticker: 'VICA',rate: '1 VICA = 0.52 USD',   amount: '10,023 VICA', usd: 313.30 },
]
const ARB_ASSETS = [
  { name: 'Bitcoin',     ticker: 'BTC', market: 'Binance/Upbit', funds: '0.71632 BTC', profit: 2000 },
  { name: 'Ethereum',    ticker: 'ETH', market: 'Binance/Upbit', funds: '2.13 ETH',    profit: 1000 },
  { name: 'Tether USDt', ticker: 'USDT',market: 'Binance/Upbit', funds: '1204 USDT',   profit: 700 },
  { name: 'ViCA',        ticker: 'VICA',market: 'Binance/Upbit', funds: '0.71632 BTC',  profit: 300 },
]
const TRANSACTIONS = [
  { type: 'Withdraw', ticker: 'BTC', asset: 'Bitcoin',      date: 'Dec 20, 11:03 PM', amount: '0.0278 BTC',  usd: '32,856.47', addr: 'To: 0xb934...05744E',   status: 'Pending' },
  { type: 'Deposit',  ticker: 'ETH', asset: 'Ethereum',     date: 'Dec 20, 11:03 PM', amount: '0.0278 ETH',  usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Completed' },
  { type: 'Invest',   ticker: 'USDT',asset: 'Tether USDT',  date: 'Dec 20, 11:03 PM', amount: '0.0278 USDT', usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Cancelled' },
  { type: 'Convert',  ticker: 'VICA',asset: 'ViCA',         date: 'Dec 20, 11:03 PM', amount: '0.0278 VICA', usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Completed' },
  { type: 'Withdraw', ticker: 'BTC', asset: 'Bitcoin',      date: 'Dec 20, 11:03 PM', amount: '0.0278 BTC',  usd: '32,856.47', addr: 'To: 0xb934...05744E',   status: 'Pending' },
  { type: 'Convert',  ticker: 'VICA',asset: 'ViCA',         date: 'Dec 20, 11:03 PM', amount: '0.0278 VICA', usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Completed' },
  { type: 'Invest',   ticker: 'USDT',asset: 'Tether USDT',  date: 'Dec 20, 11:03 PM', amount: '0.0278 USDT', usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Cancelled' },
  { type: 'Transfer', ticker: 'ETH', asset: 'Ethereum',     date: 'Dec 20, 11:03 PM', amount: '0.0278 ETH',  usd: '32,856.47', addr: 'From: 0xb934...05744E', status: 'Completed' },
]
const ADDRESSES = [
  { ticker: 'BTC', crypto: 'Bitcoin',     addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77213', net: 'Ethereum (ERC20)' },
  { ticker: 'USDT',crypto: 'Tether USDt', addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77212', net: 'Tron (TRC20)' },
  { ticker: 'ETH', crypto: 'Ethereum',    addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77212', net: 'Ethereum (ERC20)' },
  { ticker: 'VICA',crypto: 'ViCA',        addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77212', net: 'Ethereum (ERC20)' },
  { ticker: 'USDT',crypto: 'Tether USDt', addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77212', net: 'Tron (TRC20)' },
  { ticker: 'BTC', crypto: 'Bitcoin',     addr: '0xb934...05744E', label: 'Wallet 1#2', memo: '77213', net: 'Ethereum (ERC20)' },
  { ticker: 'VICA',crypto: 'ViCA',        addr: 'TXPLNP...bvFXkU', label: 'Wallet 1#2', memo: '77212', net: 'Tron (TRC20)' },
]

const portfolioData = [
  { d: 'Dec 14', v: 8000 }, { d: 'Dec 15', v: 5000 }, { d: 'Dec 16', v: 9000 },
  { d: 'Dec 17', v: 6000 }, { d: 'Dec 18', v: 3200 }, { d: 'Dec 19', v: 2997 }, { d: 'Dec 20', v: 4500 },
]
const donutData = [{ name: 'Main', v: 60, color: '#6d4eff' }, { name: 'Arbitrage', v: 40, color: '#22c55e' }]

/* ── BALANCE ──────────────────────────────────────────────── */
export function BalancePage() {
  const [tab, setTab] = useState('Wallet Overview')
  return (
    <main className="page-wrap">
      <h1 className="page-title">Balance</h1>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div className="tabs-bar" style={{ padding: '0 28px', marginBottom: 0, background: 'var(--card2)' }}>
          {['Wallet Overview', 'Main Wallet', 'Arbitrage Wallet'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === 'Wallet Overview'  && <WalletOverview />}
        {tab === 'Main Wallet'      && <MainWallet />}
        {tab === 'Arbitrage Wallet' && <ArbWallet />}
      </div>
      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}

function TotalBanner({ worth, btc, change, showAllActions }) {
  return (
    <div className="total-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Total Worth</div>
          <div className="total-amount">{worth} USDT ▾</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
            <span>≈ {btc} BTC</span>
            <PriceChange val={change} />
            <select className="inp" style={{ width: 'auto', padding: '2px 10px', fontSize: 12, border: '1px solid var(--border2)' }}>
              <option>24H</option><option>7D</option><option>30D</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm">↑ Withdraw</button>
          <button className="btn btn-outline btn-sm">↓ Deposit</button>
          <button className="btn btn-outline btn-sm">→ Invest</button>
          {showAllActions && <>
            <button className="btn btn-outline btn-sm">⇄ Convert</button>
            <button className="btn btn-outline btn-sm">⇌ Transfer</button>
          </>}
        </div>
      </div>
    </div>
  )
}

function AssetsTable() {
  const { prices } = useLivePrices()
  const [hide0, setHide0] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = ASSETS.filter(a =>
    (!hide0 || a.usd > 0) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.ticker.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Assets List</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ fontSize: 12.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={hide0} onChange={e => setHide0(e.target.checked)} style={{ accentColor: 'var(--accent)' }} /> Hide 0 Balance
          </label>
          <input className="inp" placeholder="Search by asset name..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, fontSize: 12.5 }} />
        </div>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Name</th><th>Holding Amount</th><th>Value in USD</th>
            <th>Live Price</th><th>24H Change</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AssetIcon ticker={a.ticker} size={32} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name} <span style={{ color: 'var(--muted)' }}>{a.ticker}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.rate}</div>
                  </div>
                </div>
              </td>
              <td style={{ fontSize: 13 }}>{a.amount}</td>
              <td style={{ fontSize: 13, fontWeight: 500 }}>${a.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td style={{ fontSize: 13 }}>
                {prices[a.ticker] ? `$${prices[a.ticker].usd >= 1 ? prices[a.ticker].usd.toLocaleString('en-US', { minimumFractionDigits: 2 }) : prices[a.ticker].usd.toFixed(4)}` : '—'}
              </td>
              <td>{prices[a.ticker] ? <PriceChange val={prices[a.ticker].change} /> : '—'}</td>
              <td>
                {['Withdraw', 'Deposit', 'Transfer', 'Invest', 'Convert'].map(ac => (
                  <button key={ac} className="act-link">{ac}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WalletOverview() {
  const [chartPeriod, setChartPeriod] = useState('Day')
  return (
    <>
      <TotalBanner worth="876,676.90" btc="2.21" change={12.1} showAllActions />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', borderBottom: '1px solid var(--border)' }}>
        {/* Donut */}
        <div style={{ padding: 24, borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Assets Allocation</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
              <PieChart width={140} height={140}>
                <Pie data={donutData} dataKey="v" cx={70} cy={70} innerRadius={46} outerRadius={68}>
                  {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>60%</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>≈ 2,997 USD</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              {donutData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--muted)' }}>{d.name} Wallet</span>
                  <span style={{ fontWeight: 600 }}>{d.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Portfolio chart */}
        <div style={{ padding: 24 }}>
          <div className="chart-header">
            <div style={{ fontSize: 13, fontWeight: 600 }}>Asset Worth Chart</div>
            <div className="time-toggle">
              {['Day', 'Week', 'Month', 'Year', 'All'].map(p => (
                <button key={p} className={`time-btn ${p === chartPeriod ? 'active' : ''}`} onClick={() => setChartPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={portfolioData} margin={{ top: 10, bottom: 0, left: -20, right: 0 }}>
              <defs>
                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6d4eff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6d4eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1735', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }} formatter={v => ['$' + v.toLocaleString(), 'Portfolio Value']} />
              <Area type="monotone" dataKey="v" stroke="#6d4eff" strokeWidth={2} fill="url(#portGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AssetsTable />
    </>
  )
}

function MainWallet() {
  return (
    <>
      <TotalBanner worth="876,676.90" btc="2.21" change={12.1} showAllActions />
      <AssetsTable />
    </>
  )
}

function ArbWallet() {
  const totalProfit = ARB_ASSETS.reduce((s, a) => s + a.profit, 0)
  return (
    <div style={{ padding: 28 }}>
      <TotalBanner worth="76,676.90" btc="2.21" change={12.1} showAllActions={false} />
      <div style={{ display: 'flex', gap: 32, margin: '20px 0', paddingTop: 4 }}>
        {[['Active Funds', '12,035.53 USD'], ['Idle Funds', '6,087.08 USD'], ['Profit', `+${totalProfit.toLocaleString()} USDT`]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: l === 'Profit' ? 'var(--green)' : 'var(--text)' }}>{v}</div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm">◈ Claim All Profits</button>
          <button className="btn btn-outline btn-sm">→ Invest More</button>
          <button className="btn btn-outline btn-sm">⇌ Transfer</button>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Assets Running in Arbitrage</div>
      <table className="tbl">
        <thead><tr><th>Name</th><th>Markets</th><th>Funds Used</th><th>Profits</th><th>Actions</th></tr></thead>
        <tbody>
          {ARB_ASSETS.map((a, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AssetIcon ticker={a.ticker} size={30} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name} <span style={{ color: 'var(--muted)' }}>{a.ticker}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>1 BTC = 41,940 USD</div>
                  </div>
                </div>
              </td>
              <td style={{ fontSize: 13 }}>{a.market}</td>
              <td style={{ fontSize: 13 }}>{a.funds}</td>
              <td style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>+{a.profit.toLocaleString()} USDT</td>
              <td>
                <button className="act-link">Claim Profits</button>
                <button className="act-link danger">Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── TRANSACTIONS ─────────────────────────────────────────── */
export function TransactionsPage() {
  const [assetFilter, setAssetFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateFrom] = useState('Dec 8, 2023')
  const [dateTo]   = useState('Jan 1, 2024')

  const filtered = useMemo(() =>
    TRANSACTIONS.filter(t =>
      (assetFilter === 'All' || t.ticker === assetFilter) &&
      (typeFilter === 'All' || t.type === typeFilter)
    ), [assetFilter, typeFilter])

  const TYPE_COLORS = { Withdraw: 'var(--yellow)', Deposit: 'var(--green)', Invest: 'var(--accent2)', Convert: 'var(--blue)', Transfer: '#8b5cf6' }
  const TYPE_ICONS = { Withdraw: '↑', Deposit: '↓', Invest: '→', Convert: '⇄', Transfer: '⇌' }

  return (
    <main className="page-wrap">
      <h1 className="page-title">Transactions</h1>
      <div className="card">
        <div className="filter-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input className="inp" defaultValue={dateFrom} style={{ width: 126, fontSize: 12.5 }} />
            <span style={{ color: 'var(--muted)' }}>→</span>
            <input className="inp" defaultValue={dateTo} style={{ width: 126, fontSize: 12.5 }} />
            <button className="filter-chip">📅</button>
          </div>
          <select className="inp" style={{ width: 100, fontSize: 12.5 }} value={assetFilter} onChange={e => setAssetFilter(e.target.value)}>
            <option>All</option>{['BTC', 'ETH', 'USDT', 'VICA'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="inp" style={{ width: 120, fontSize: 12.5 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>All</option>{['Withdraw', 'Deposit', 'Invest', 'Convert', 'Transfer'].map(t => <option key={t}>{t}</option>)}
          </select>
          {(assetFilter !== 'All' || typeFilter !== 'All') && (
            <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)' }} onClick={() => { setAssetFilter('All'); setTypeFilter('All') }}>
              ✕ Reset
            </button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm">↻ Refresh</button>
            <button className="btn btn-outline btn-sm">↑ Export</button>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Type</th><th>Assets</th><th>Date</th><th>Amount</th><th>Est. USD</th><th>To/From</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i}>
                <td>
                  <span style={{ color: TYPE_COLORS[t.type], fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>{TYPE_ICONS[t.type]}</span> {t.type}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <AssetIcon ticker={t.ticker} size={24} />
                    <span style={{ fontSize: 13 }}>{t.asset}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{t.date}</td>
                <td style={{ fontSize: 13 }}>{t.amount}</td>
                <td style={{ fontSize: 13 }}>${t.usd} USD</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {t.addr} <button style={{ background: 'none', color: 'var(--muted)', fontSize: 10, padding: '0 3px' }}>⇌</button>
                </td>
                <td><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>No transactions found</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 4px', fontSize: 12, color: 'var(--muted)' }}>
          <span>{filtered.length} transactions</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['‹', '1', '2', '3', '›'].map((p, i) => (
              <button key={i} style={{ width: 28, height: 28, borderRadius: 6, background: p === '1' ? 'var(--accent)' : 'var(--bg3)', color: p === '1' ? '#fff' : 'var(--muted)', fontSize: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}

/* ── ADDRESSES ────────────────────────────────────────────── */
export function AddressesPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [newAddr, setNewAddr] = useState({ crypto: 'BTC', address: '', label: '', memo: '', net: 'Ethereum (ERC20)' })
  const [list, setList] = useState(ADDRESSES)
  const [cryptoFilter, setCryptoFilter] = useState('All')

  const filtered = list.filter(a => cryptoFilter === 'All' || a.ticker === cryptoFilter)

  const handleAdd = () => {
    if (!newAddr.address) return
    setList([...list, { ticker: newAddr.crypto, crypto: newAddr.crypto, addr: newAddr.address, label: newAddr.label || 'Wallet 1#1', memo: newAddr.memo || '—', net: newAddr.net }])
    setNewAddr({ crypto: 'BTC', address: '', label: '', memo: '', net: 'Ethereum (ERC20)' })
    setShowAdd(false)
  }

  return (
    <main className="page-wrap">
      <h1 className="page-title">Addresses</h1>
      <div className="card">
        <div className="filter-row" style={{ marginBottom: 16 }}>
          <select className="inp" style={{ width: 110, fontSize: 12.5 }} value={cryptoFilter} onChange={e => setCryptoFilter(e.target.value)}>
            <option>All</option>{['BTC', 'ETH', 'USDT', 'VICA'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="inp" style={{ width: 140, fontSize: 12.5 }}><option>All</option><option>Withdrawal</option><option>Deposit</option></select>
          <select className="inp" style={{ width: 100, fontSize: 12.5 }}><option>All</option><option>Whitelisted</option><option>Not Whitelisted</option></select>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add New Address'}
          </button>
        </div>

        {showAdd && (
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Add New Address</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) auto', gap: 12, alignItems: 'flex-end' }}>
              {[
                { label: 'Crypto', el: <select className="inp" value={newAddr.crypto} onChange={e => setNewAddr({ ...newAddr, crypto: e.target.value })}>{['BTC', 'ETH', 'USDT', 'VICA'].map(t => <option key={t}>{t}</option>)}</select> },
                { label: 'Address', el: <input className="inp" placeholder="0x..." value={newAddr.address} onChange={e => setNewAddr({ ...newAddr, address: e.target.value })} /> },
                { label: 'Label', el: <input className="inp" placeholder="Wallet label" value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} /> },
                { label: 'Memo/Tag', el: <input className="inp" placeholder="Optional" value={newAddr.memo} onChange={e => setNewAddr({ ...newAddr, memo: e.target.value })} /> },
                { label: 'Network', el: <select className="inp" value={newAddr.net} onChange={e => setNewAddr({ ...newAddr, net: e.target.value })}>{['Ethereum (ERC20)', 'Tron (TRC20)', 'BSC (BEP20)'].map(n => <option key={n}>{n}</option>)}</select> },
              ].map(({ label, el }) => (
                <div className="form-group" key={label}><label className="form-label">{label}</label>{el}</div>
              ))}
              <button className="btn btn-primary" style={{ height: 38, alignSelf: 'flex-end' }} onClick={handleAdd}>Save</button>
            </div>
          </div>
        )}

        <table className="tbl">
          <thead><tr><th>Crypto</th><th>Address</th><th>Address Label</th><th>Memo/Tag</th><th>Network</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AssetIcon ticker={a.ticker} size={24} />
                    <span style={{ fontSize: 13 }}>{a.crypto} <span style={{ color: 'var(--muted)' }}>{a.ticker}</span></span>
                  </div>
                </td>
                <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text2)' }}>{a.addr}</td>
                <td style={{ fontSize: 13 }}>{a.label}</td>
                <td style={{ fontSize: 13 }}>{a.memo}</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{a.net}</td>
                <td>
                  <button className="act-link">Edit</button>
                  <button className="act-link danger" onClick={() => setList(list.filter((_, j) => j !== list.indexOf(a)))}>Delete</button>
                  <button className="act-link success">On Whitelist</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}

/* ── CONVERT ──────────────────────────────────────────────── */
const MOCK_RATES = { ETH: { USDT: 3000.32, BTC: 0.0815, VICA: 5769 }, BTC: { USDT: 41940, ETH: 12.27, VICA: 80654 }, USDT: { ETH: 0.000333, BTC: 0.0000238, VICA: 27.12 }, VICA: { USDT: 0.52, ETH: 0.000173, BTC: 0.0000124 } }
const TOKEN_NAMES = { ETH: 'Ethereum', BTC: 'Bitcoin', USDT: 'Tether USDt', VICA: 'ViCA' }

export function ConvertPage() {
  const [from, setFrom] = useState({ token: 'ETH', amount: '1.28936' })
  const [to,   setTo]   = useState({ token: 'USDT' })
  const [swapping, setSwapping] = useState(false)
  const { prices } = useLivePrices()

  const rate = MOCK_RATES[from.token]?.[to.token] ?? 1
  const toAmount = (parseFloat(from.amount) || 0) * rate

  const swap = () => {
    setSwapping(true)
    setTimeout(() => setSwapping(false), 400)
    setFrom({ token: to.token, amount: from.amount })
    setTo({ token: from.token })
  }

  const recent = [
    { a: 'USDT', b: 'ETH', av: '1,289.32', bv: '0.532' },
    { a: 'ETH',  b: 'USDT', av: '0.532',   bv: '1,289.32' },
    { a: 'USDT', b: 'ETH', av: '1,289.32', bv: '0.532' },
    { a: 'USDT', b: 'ETH', av: '1,289.32', bv: '0.532' },
  ]

  const tokens = ['ETH', 'BTC', 'USDT', 'VICA']

  return (
    <main className="page-wrap">
      <h1 className="page-title">Convert</h1>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div className="convert-side">
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
                Available: {prices[from.token] ? `${(2000 / prices[from.token].usd).toFixed(5)} ${from.token}` : `12.34568 ${from.token}`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Converting</div>
              <input
                className="convert-amount-input"
                value={from.amount}
                onChange={e => setFrom({ ...from, amount: e.target.value })}
              />
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 14 }}>Min: 0.00002396 {from.token}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AssetIcon ticker={from.token} size={24} />
                <select
                  value={from.token}
                  onChange={e => setFrom({ ...from, token: e.target.value })}
                  style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  {tokens.filter(t => t !== to.token).map(t => <option key={t}>{t}</option>)}
                </select>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{TOKEN_NAMES[from.token]}</span>
              </div>
            </div>

            <button
              className="swap-circle"
              onClick={swap}
              style={{ transform: swapping ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease', flexShrink: 0 }}
            >
              ⇄
            </button>

            <div className="convert-side">
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
                Available: {prices[to.token] ? `${(2000 / prices[to.token].usd).toFixed(5)} ${to.token}` : `12.34568 ${to.token}`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Will Receive</div>
              <input
                className="convert-amount-input"
                value={toAmount.toFixed(5)}
                readOnly
                style={{ color: 'var(--muted)' }}
              />
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 14, textAlign: 'right' }}>
                ↻ Exchange Rate: 1 {from.token} = {rate.toLocaleString()} {to.token}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AssetIcon ticker={to.token} size={24} />
                <select
                  value={to.token}
                  onChange={e => setTo({ token: e.target.value })}
                  style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  {tokens.filter(t => t !== from.token).map(t => <option key={t}>{t}</option>)}
                </select>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{TOKEN_NAMES[to.token]}</span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: 200, margin: '0 auto', display: 'flex' }}>
            Convert
          </button>

          {/* Recent */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14, fontWeight: 500 }}>Latest Conversions</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', fontSize: 12.5 }}>
                  <AssetIcon ticker={r.a} size={18} />
                  <div><span style={{ fontWeight: 600 }}>{r.a}</span> <span style={{ color: 'var(--muted)' }}>{r.av}</span></div>
                  <span style={{ color: 'var(--accent2)', fontSize: 14 }}>⇄</span>
                  <AssetIcon ticker={r.b} size={18} />
                  <div><span style={{ fontWeight: 600 }}>{r.b}</span> <span style={{ color: 'var(--muted)' }}>{r.bv}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}
