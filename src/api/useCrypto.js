import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const BASE = 'https://api.coingecko.com/api/v3'

const COIN_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  VICA: 'bitcoin', // fallback — replace with real VICA id if listed
}

export function useLivePrices() {
  const [prices, setPrices] = useState({
    BTC: { usd: 67420, change: 2.4 },
    ETH: { usd: 3480, change: 1.8 },
    USDT: { usd: 1.0, change: 0.01 },
    VICA: { usd: 0.52, change: -1.2 },
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    try {
      const ids = Object.values(COIN_IDS).join(',')
      const res = await axios.get(`${BASE}/simple/price`, {
        params: { ids, vs_currencies: 'usd', include_24hr_change: true },
        timeout: 8000,
      })
      const d = res.data
      setPrices({
        BTC: { usd: d.bitcoin?.usd ?? 67420, change: d.bitcoin?.usd_24h_change ?? 2.4 },
        ETH: { usd: d.ethereum?.usd ?? 3480, change: d.ethereum?.usd_24h_change ?? 1.8 },
        USDT: { usd: d.tether?.usd ?? 1.0, change: d.tether?.usd_24h_change ?? 0.01 },
        VICA: { usd: 0.52, change: -1.2 }, // custom token
      })
      setLastUpdated(new Date())
    } catch {
      // silently keep last known prices
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, loading, lastUpdated, refetch: fetchPrices }
}

export function useMarketData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,tether',
            order: 'market_cap_desc',
            sparkline: true,
            price_change_percentage: '24h,7d',
          },
          timeout: 8000,
        })
        setData(res.data)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading }
}

export function useRevenueChart(range = 'Weekly') {
  // Simulated – replace with real backend endpoint
  const weekly = [
    { d: 'Sun', v: 12000 }, { d: 'Mon', v: 18000 }, { d: 'Tue', v: 22000 },
    { d: 'Wed', v: 90292 }, { d: 'Thu', v: 60000 }, { d: 'Fri', v: 75000 }, { d: 'Sat', v: 55000 },
  ]
  const monthly = Array.from({ length: 30 }, (_, i) => ({
    d: `${i + 1}`, v: Math.floor(20000 + Math.random() * 80000),
  }))
  const yearly = [
    { d: 'Jan', v: 420000 }, { d: 'Feb', v: 380000 }, { d: 'Mar', v: 510000 },
    { d: 'Apr', v: 460000 }, { d: 'May', v: 620000 }, { d: 'Jun', v: 590000 },
    { d: 'Jul', v: 710000 }, { d: 'Aug', v: 680000 }, { d: 'Sep', v: 750000 },
    { d: 'Oct', v: 820000 }, { d: 'Nov', v: 900000 }, { d: 'Dec', v: 960000 },
  ]
  return { Weekly: weekly, Monthly: monthly, Yearly: yearly }[range] ?? weekly
}
