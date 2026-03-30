import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import '../src/styles/globals.css'
import { Navbar, TickerBar } from './components/shared'
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import { BalancePage, TransactionsPage, AddressesPage, ConvertPage } from './pages/Wallet'
import { InvestPage, SecurityPage, LoginPage, RegisterPage } from './pages/Auth'

function Layout({ children, showTicker = true }) {
  return (
    <>
      <Navbar />
      {showTicker && <TickerBar />}
      {children}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1735',
            color: '#e8e4ff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13.5px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/invest" element={<Layout><InvestPage /></Layout>} />
        <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
        <Route path="/wallet" element={<Navigate to="/wallet/balance" replace />} />
        <Route path="/wallet/balance" element={<Layout><BalancePage /></Layout>} />
        <Route path="/wallet/transactions" element={<Layout><TransactionsPage /></Layout>} />
        <Route path="/wallet/addresses" element={<Layout><AddressesPage /></Layout>} />
        <Route path="/wallet/convert" element={<Layout><ConvertPage /></Layout>} />
        <Route path="/login" element={<Layout showTicker={false}><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout showTicker={false}><RegisterPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
