import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Footer, Logo, AssetIcon } from '../components/shared'

/* ══════════════════════════════════════════════════════════
   INVEST PAGE
══════════════════════════════════════════════════════════ */
const PLANS = [
  {
    name: 'Starter',
    period: '1 Month',
    apy: '8.2%',
    min: '$100',
    max: '$4,999',
    features: ['Automated arbitrage trading', 'Daily profit reports', 'Basic support', 'Instant withdrawal'],
    featured: false,
  },
  {
    name: 'Growth',
    period: '3 Months',
    apy: '32.1%',
    min: '$5,000',
    max: '$49,999',
    features: ['All Starter features', 'Priority execution order', 'Dedicated account manager', 'Compound interest option', 'API access'],
    featured: true,
  },
  {
    name: 'Elite',
    period: '1 Year',
    apy: '143.2%',
    min: '$50,000',
    max: 'Unlimited',
    features: ['All Growth features', 'Private bot configuration', 'Quarterly strategy review', 'White-glove onboarding', 'Custom withdrawal schedule', 'Multi-exchange routing'],
    featured: false,
  },
]

const TOKENS = ['ETH', 'BTC', 'USDT', 'VICA']

export function InvestPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(1)
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState('ETH')
  const [step, setStep] = useState(1) // 1=plans 2=confirm

  const plan = PLANS[selected]
  const apy = parseFloat(plan.apy)
  const months = plan.period === '1 Month' ? 1 : plan.period === '3 Months' ? 3 : 12
  const profit = (parseFloat(amount) || 0) * (apy / 100)

  return (
    <main className="page-wrap">
      {step === 1 && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 className="section-title" style={{ marginBottom: 12 }}>Choose Your Investment Plan</h1>
            <p className="section-sub">All plans are backed by our algorithmic arbitrage engine with zero recorded losses since 2020.</p>
          </div>

          {/* Plans grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 56 }}>
            {PLANS.map((p, i) => (
              <div
                key={p.name}
                className={`plan-card ${p.featured ? 'featured' : ''} ${selected === i ? '' : ''}`}
                onClick={() => setSelected(i)}
                style={{ cursor: 'pointer', borderColor: selected === i ? 'var(--accent)' : p.featured ? 'var(--accent)' : 'var(--border)' }}
              >
                {p.featured && <div className="plan-badge">Most Popular</div>}
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{p.period}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>{p.name}</div>
                <div className="plan-apy">{p.apy}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 24 }}>Annual Percentage Yield</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>
                  Min: <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{p.min}</span>
                  {' '} · Max: <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{p.max}</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  {p.features.map(f => <div key={f} className="plan-feature">{f}</div>)}
                </div>
                <button
                  className={`btn btn-full ${selected === i ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => { setSelected(i); setStep(2) }}
                >
                  {selected === i ? '✓ Selected — Configure' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
            {[['$1.62B+', 'Total assets managed'], ['50,000+', 'Active investors'], ['0 losses', 'Since launch in 2020'], ['24/7', 'Bot uptime guarantee']].map(([v, l]) => (
              <div key={l} className="card" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--accent2)', marginBottom: 6 }}>{v}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }} onClick={() => setStep(1)}>
            ← Back to plans
          </button>
          <h2 className="page-title">Configure Investment</h2>
          <div className="card">
            {/* Plan summary */}
            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 24, border: '1px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Selected Plan</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{plan.name} · {plan.period}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--accent2)' }}>{plan.apy}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>APY</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Select Token</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {TOKENS.map(t => (
                    <button key={t} onClick={() => setToken(t)}
                      style={{ padding: '10px 8px', borderRadius: 8, border: `1px solid ${token === t ? 'var(--accent)' : 'var(--border)'}`, background: token === t ? 'rgba(109,78,255,0.12)' : 'var(--bg3)', color: token === t ? 'var(--accent2)' : 'var(--muted)', fontSize: 13, fontWeight: 600, transition: 'all var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <AssetIcon ticker={t} size={18} /> {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Investment Amount ({token})</label>
                <div style={{ position: 'relative' }}>
                  <input className="inp" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingRight: 60 }} />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 13 }}>{token}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>Minimum: {plan.min} · Maximum: {plan.max}</div>
              </div>
            </div>

            {/* Projection */}
            <div style={{ background: 'linear-gradient(135deg, rgba(109,78,255,0.08), rgba(109,78,255,0.03))', border: '1px solid rgba(109,78,255,0.2)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Return Projection</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Investment', `${parseFloat(amount) || 0} ${token}`], ['Expected Profit', `+${profit.toFixed(4)} ${token}`], ['Total Return', `${((parseFloat(amount) || 0) + profit).toFixed(4)} ${token}`], ['Duration', plan.period]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: l === 'Expected Profit' || l === 'Total Return' ? 'var(--green)' : 'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/wallet/balance')}>
              Confirm Investment
            </button>
            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 12 }}>
              By investing you agree to our Terms of Service. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}

/* ══════════════════════════════════════════════════════════
   SECURITY PAGE
══════════════════════════════════════════════════════════ */
export function SecurityPage() {
  const [twoFA, setTwoFA]           = useState(false)
  const [smsAuth, setSmsAuth]       = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [withdrawalWhitelist, setWithdrawalWhitelist] = useState(false)
  const [antiPhishing, setAntiPhishing] = useState(false)
  const [showPassChange, setShowPassChange] = useState(false)
  const [pass, setPass] = useState({ current: '', new: '', confirm: '' })

  const Toggle = ({ checked, onChange }) => (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )

  return (
    <main className="page-wrap">
      <h1 className="page-title">Security</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 2FA */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Two-Factor Authentication</div>
            {[
              { label: 'Authenticator App (Google/Authy)', sub: 'Use an authentication app to generate one-time codes', state: twoFA, set: setTwoFA, badge: twoFA ? 'badge-green' : 'badge-yellow' },
              { label: 'SMS Authentication', sub: 'Receive login codes via SMS to +1 *** *** 4829', state: smsAuth, set: setSmsAuth, badge: smsAuth ? 'badge-green' : null },
            ].map(({ label, sub, state, set, badge }) => (
              <div key={label} className="security-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
                    {badge && <span className={`badge ${badge}`}>{state ? 'Enabled' : 'Disabled'}</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{sub}</div>
                </div>
                <Toggle checked={state} onChange={set} />
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Security Notifications</div>
            {[
              { label: 'Email Notifications', sub: 'Receive email alerts for logins, withdrawals, and large trades', state: emailNotif, set: setEmailNotif },
              { label: 'Withdrawal Whitelist', sub: 'Only allow withdrawals to pre-approved wallet addresses', state: withdrawalWhitelist, set: setWithdrawalWhitelist },
              { label: 'Anti-Phishing Code', sub: 'Add a unique code to all ViBoT emails to verify authenticity', state: antiPhishing, set: setAntiPhishing },
            ].map(({ label, sub, state, set }) => (
              <div key={label} className="security-row">
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{sub}</div>
                </div>
                <Toggle checked={state} onChange={set} />
              </div>
            ))}
          </div>

          {/* Password */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPassChange ? 20 : 0 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Password</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Last changed 45 days ago</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowPassChange(!showPassChange)}>
                {showPassChange ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {showPassChange && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[['Current Password', 'current'], ['New Password', 'new'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <div className="pass-wrap">
                      <input className="inp" type="password" value={pass[key]} onChange={e => setPass({ ...pass, [key]: e.target.value })} placeholder="••••••••" />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }}>Update Password</button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Security score */}
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Security Score</div>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
              <svg viewBox="0 0 120 120" width={120} height={120}>
                <circle cx={60} cy={60} r={50} fill="none" stroke="var(--bg3)" strokeWidth={10} />
                <circle cx={60} cy={60} r={50} fill="none" stroke={smsAuth && emailNotif ? '#22c55e' : '#f59e0b'} strokeWidth={10}
                  strokeDasharray={`${Math.PI * 100 * ([twoFA, smsAuth, emailNotif, withdrawalWhitelist, antiPhishing].filter(Boolean).length / 5)} ${Math.PI * 100}`}
                  strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800 }}>
                  {Math.round(([twoFA, smsAuth, emailNotif, withdrawalWhitelist, antiPhishing].filter(Boolean).length / 5) * 100)}%
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: smsAuth && emailNotif ? 'var(--green)' : 'var(--yellow)' }}>
              {[twoFA, smsAuth, emailNotif, withdrawalWhitelist, antiPhishing].filter(Boolean).length >= 4 ? 'Strong Security' : 'Moderate Security'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>Enable all features for maximum protection</div>
          </div>

          {/* Active sessions */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Active Sessions</div>
            {[
              { device: 'MacBook Pro', location: 'Dubai, UAE', time: 'Current session', current: true },
              { device: 'iPhone 15', location: 'Dubai, UAE', time: '2 hours ago', current: false },
              { device: 'Chrome Windows', location: 'Lahore, PK', time: '1 day ago', current: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {s.device.includes('iPhone') ? '📱' : s.device.includes('Chrome') ? '🌐' : '💻'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.device} {s.current && <span className="badge badge-green" style={{ fontSize: 10 }}>Current</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.location} · {s.time}</div>
                  </div>
                </div>
                {!s.current && <button className="btn btn-danger btn-sm">Revoke</button>}
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Security Events</div>
            {[
              { icon: '✓', label: 'Successful login', time: '2 min ago', color: 'var(--green)' },
              { icon: '↑', label: 'Withdrawal of 0.5 ETH', time: '2 hours ago', color: 'var(--yellow)' },
              { icon: '⚙', label: 'Password changed', time: '45 days ago', color: 'var(--accent2)' },
              { icon: '✓', label: 'Account created', time: 'Jun 2023', color: 'var(--muted)' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: e.color, flexShrink: 0 }}>{e.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{e.label}</div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', white: 'nowrap' }}>{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 56 }}><Footer /></div>
    </main>
  )
}

/* ══════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════ */
export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Logo size={32} /><span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>ViBoT</span></div>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to access your arbitrage dashboard</p>

        <div className="social-login">
          <button className="social-login-btn">🌐 Google</button>
          <button className="social-login-btn">🍎 Apple</button>
        </div>
        <div className="auth-divider">or continue with email</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="inp" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pass-wrap">
              <input className="inp" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ paddingRight: 42 }} />
              <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '👁' : '👁‍🗨'}</button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 13 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--muted)' }}>
            <input type="checkbox" style={{ accentColor: 'var(--accent)' }} /> Remember me
          </label>
          <button style={{ color: 'var(--accent2)', background: 'none', fontSize: 13 }}>Forgot password?</button>
        </div>

        <button className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`} onClick={handleSubmit}>
          {loading ? '⏳ Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 600 }}>Create account</Link>
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════ */
export function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', referral: '' })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const strength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', 'var(--red)', 'var(--yellow)', 'var(--blue)', 'var(--green)']
  const ps = strength(form.password)

  const validateStep1 = () => {
    const errs = {}
    if (!form.firstName) errs.firstName = 'Required'
    if (!form.lastName) errs.lastName = 'Required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    return errs
  }
  const validateStep2 = () => {
    const errs = {}
    if (!form.password || form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (!agreed) errs.agreed = 'You must agree to the terms'
    return errs
  }

  const handleNext = () => {
    const errs = step === 1 ? validateStep1() : validateStep2()
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 1400)
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Logo size={32} /><span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20 }}>ViBoT</span></div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map((s, i) => (
            <>
              <div key={s} style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s ? 'var(--accent)' : 'var(--bg3)', border: `1px solid ${step >= s ? 'var(--accent)' : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: step >= s ? '#fff' : 'var(--muted)', transition: 'all var(--transition)' }}>{s}</div>
              {i < 2 && <div style={{ width: 32, height: 1, background: step > s ? 'var(--accent)' : 'var(--border)' }} />}
            </>
          ))}
        </div>

        {step === 3 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Account Created!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 28 }}>Welcome to ViBoT, {form.firstName}! Check your email to verify your account.</p>
            <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        ) : step === 1 ? (
          <>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-sub">Start your crypto arbitrage journey today</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['First Name', 'firstName'], ['Last Name', 'lastName']].map(([l, k]) => (
                <div className="form-group" key={k}>
                  <label className="form-label">{l}</label>
                  <input className="inp" placeholder={l} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                  {errors[k] && <div className="form-error">{errors[k]}</div>}
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Email Address</label>
              <input className="inp" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Referral Code (optional)</label>
              <input className="inp" placeholder="e.g. VICA2024" value={form.referral} onChange={e => setForm({ ...form, referral: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-lg btn-full" onClick={handleNext}>Continue →</button>
          </>
        ) : (
          <>
            <h1 className="auth-title">Set Password</h1>
            <p className="auth-sub">Create a strong password to protect your account</p>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input className="inp" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 42 }} />
                <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '👁' : '👁‍🗨'}</button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= ps ? strengthColors[ps] : 'var(--bg4)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11.5, color: strengthColors[ps], marginTop: 4 }}>{strengthLabel[ps]}</div>
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Confirm Password</label>
              <input className="inp" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              {errors.confirm && <div className="form-error">{errors.confirm}</div>}
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginBottom: 20, fontSize: 12.5, color: 'var(--muted)' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: 'var(--accent)', marginTop: 2 }} />
              I agree to the <span style={{ color: 'var(--accent2)' }}>Terms of Service</span> and <span style={{ color: 'var(--accent2)' }}>Privacy Policy</span>
            </label>
            {errors.agreed && <div className="form-error" style={{ marginTop: -12, marginBottom: 12 }}>{errors.agreed}</div>}
            <button className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`} onClick={handleNext}>
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </>
        )}

        {step < 3 && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent2)', fontWeight: 600 }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  )
}
