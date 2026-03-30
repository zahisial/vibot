import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useLivePrices } from '../api/useCrypto'

/* ── Logo ──────────────────────────────────────────────────── */
export function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#6d4eff" fillOpacity="0.18" />
      <circle cx="16" cy="16" r="15" stroke="#6d4eff" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M10 21 L16 11 L22 21" stroke="#9d7fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="10.5" r="2.2" fill="#9d7fff" />
      <path d="M13 17.5 L19 17.5" stroke="#6d4eff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Asset Icon ────────────────────────────────────────────── */
const ASSET_COLORS = { BTC: '#f7931a', ETH: '#627eea', USDT: '#26a17b', VICA: '#6d4eff', KRW: '#2d9cdb' }
const ASSET_ICONS  = { BTC: '₿', ETH: 'Ξ', USDT: '₮', VICA: 'V', KRW: '₩' }

export function AssetIcon({ ticker, size = 30 }) {
  const color = ASSET_COLORS[ticker] || '#6b6890'
  const icon  = ASSET_ICONS[ticker]  || ticker?.[0] || '?'
  return (
    <div
      className="asset-icon"
      style={{
        width: size, height: size,
        background: color,
        fontSize: size * 0.42,
      }}
    >
      {icon}
    </div>
  )
}

/* ── Status Badge ──────────────────────────────────────────── */
export function StatusBadge({ status }) {
  const map = { Pending: 'badge-yellow', Completed: 'badge-green', Cancelled: 'badge-red' }
  const ico = { Pending: '⏳', Completed: '✓', Cancelled: '⊗' }
  return (
    <span className={`badge ${map[status] || 'badge-blue'}`}>
      {ico[status]} {status}
    </span>
  )
}

/* ── Price Change ──────────────────────────────────────────── */
export function PriceChange({ val, suffix = '%' }) {
  const pos = val >= 0
  return (
    <span className={pos ? 'change-up' : 'change-down'}>
      {pos ? '▲' : '▼'} {Math.abs(val).toFixed(2)}{suffix}
    </span>
  )
}

/* ── Live Ticker Bar ───────────────────────────────────────── */
export function TickerBar() {
  const { prices } = useLivePrices()
  const items = Object.entries(prices).flatMap(([ticker, { usd, change }]) => [
    { ticker, usd, change },
    { ticker, usd, change },
  ])
  const fmt = (n) =>
    n >= 1000 ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
    `$${n.toFixed(4)}`

  return (
    <div className="ticker-bar">
      <div className="ticker-inner">
        {[...items, ...items].map((it, i) => (
          <div className="ticker-item" key={i}>
            <AssetIcon ticker={it.ticker} size={18} />
            <span className="ticker-name">{it.ticker}</span>
            <span className="ticker-price">{fmt(it.usd)}</span>
            <span className={`ticker-change ${it.change >= 0 ? 'change-up' : 'change-down'}`}>
              {it.change >= 0 ? '▲' : '▼'}{Math.abs(it.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Navbar ────────────────────────────────────────────────── */
const mainLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Invest',    to: '/invest' },
  { label: 'Security',  to: '/security' },
]
const walletLinks = [
  { label: 'Balance',      to: '/wallet/balance',      icon: '⊟' },
  { label: 'Transactions', to: '/wallet/transactions',  icon: '↗' },
  { label: 'Addresses',    to: '/wallet/addresses',     icon: '0x' },
  { label: 'Convert',      to: '/wallet/convert',       icon: '⇄' },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { prices } = useLivePrices()
  const [open, setOpen] = useState(false)

  const isWallet = location.pathname.startsWith('/wallet')

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
            <Logo size={30} />
            ViBoT
          </Link>
          <div className="nav-links">
            {mainLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/wallet/balance"
              className={`nav-link ${isWallet ? 'active' : ''}`}
            >
              Wallet ▾
            </Link>
          </div>
          <div className="nav-right">
            <div className="vica-badge">
              <span style={{ color: 'var(--accent)' }}>◈</span>
              ${prices.VICA?.usd?.toFixed(2) ?? '0.52'}
              <span className="live-dot" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/register')}>Register</button>
          </div>
          <button className={`hamburger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {[...mainLinks, { label: 'Wallet', to: '/wallet/balance' }].map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <div style={{ display: 'flex', gap: 8, padding: '8px 14px' }}>
          <button className="btn btn-primary btn-sm btn-full" onClick={() => { navigate('/login'); setOpen(false) }}>Log In</button>
          <button className="btn btn-outline btn-sm btn-full" onClick={() => { navigate('/register'); setOpen(false) }}>Register</button>
        </div>
      </div>

      {/* Sub-nav for wallet */}
      {isWallet && (
        <div className="subnav">
          <div className="subnav-inner">
            {walletLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`subnav-link ${location.pathname === l.to ? 'active' : ''}`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Footer ────────────────────────────────────────────────── */
export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Logo size={28} />
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800 }}>ViBoT</span>
            </div>
            <p className="footer-brand">Pioneering Arbitrage Excellence<br />in Global Crypto Trading</p>
            <div className="social-row">
              {['T', 'in', 'f', '♪', 'fb', '▶', '🐦'].map((s, i) => (
                <button key={i} className="social-btn">{s}</button>
              ))}
            </div>
          </div>
          <div>
            <h4>For You</h4>
            {['Learn', 'Announcements', 'About'].map(l => (
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>
          <div>
            <h4>Support</h4>
            {['Contact Us', 'Terms of Services', 'Privacy Policy'].map(l => (
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>
        </div>
      </footer>
      <p className="footer-copy">Copyright © 2023. ViCA. All Rights Reserved</p>
    </>
  )
}

/* ── Loading Skeleton ──────────────────────────────────────── */
export function Skeleton({ width = '100%', height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />
}

/* ── Empty State ───────────────────────────────────────────── */
export function EmptyState({ icon = '📭', title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  )
}
