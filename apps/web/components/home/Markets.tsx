'use client'

import Image from 'next/image'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useAllToken } from '@/hooks/useAllToken'
import { applyTokenPrecision } from '@/lib/utils'
import { useHourlyMarketPrice } from '@/services/market/hourly'

const BASE_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'DOGE/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'ADA/USDT',
  'TRX/USDT',
  'LINK/USDT',
  'TON/USDT',
]

interface TokenListProps {
  onClose: () => void
  searchCoin?: string
}

const TokenList: FunctionComponent<TokenListProps> = ({ onClose: _onClose, searchCoin }) => {
  void _onClose
  const randPrice = () => Number((Math.random() * (50000 - 1) + 1).toFixed(2))
  const randChange = () => Number((Math.random() * 20 - 10).toFixed(2))
  const genSpark = () => {
    const len = 24
    let cur = Math.random() * 50 + 50
    return Array.from({ length: len }, () => {
      cur = Math.max(1, cur + (Math.random() - 0.5) * 6)
      return Number(cur.toFixed(2))
    })
  }

  const { data: hourlyData, isLoading: isHourlyLoading } = useHourlyMarketPrice('BTC-USDT')
  useEffect(() => {
    if (hourlyData) {
      console.log('BTC-USDT hourlyData:', hourlyData)
    }
  }, [hourlyData])

  const data = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: `t${i + 1}`,
        name: BASE_PAIRS[i % BASE_PAIRS.length],
        price: randPrice(),
        last: randChange(),
        change: randChange(),
        spark: genSpark(),
      })),
    []
  )
  const Sparkline: FunctionComponent<{ data: number[]; width?: number; height?: number; color?: string }> = ({
    data,
    width = 120,
    height = 34,
    color = '#FF2E65',
  }) => {
    if (!data?.length) return null
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = width / (data.length - 1)
    const coords = data.map((v, i) => ({
      x: i * stepX,
      y: height - ((v - min) / range) * height,
    }))
    const lineD = coords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
    const areaD = `${lineD} L${width},${height} L0,${height} Z`
    const gradId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} stroke="none" />
        <path d={lineD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  const [sortKey, setSortKey] = useState<null | 'name' | 'price' | 'change' | 'last'>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { tokens: allTokenData, getTokenPrecision } = useAllToken()

  const pageSize = 7

  const toggleSort = (key: 'name' | 'price' | 'change' | 'last') => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else if (sortOrder === 'desc') {
      setSortKey(null)
      setSortOrder('asc')
    }
  }

  const filtered = useMemo(
    () =>
      data.filter((d) => {
        if (!searchCoin) return true
        const key = searchCoin.trim().toLowerCase()
        const pair = d.name || ''
        const base = typeof pair === 'string' ? (pair.split('/')[0]?.toLowerCase() ?? '') : ''
        return base.includes(key)
      }),
    [data, searchCoin]
  )

  const displayData = useMemo(() => {
    if (!sortKey) return filtered
    const sorted = [...filtered]
    sorted.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [filtered, sortKey, sortOrder])

  useEffect(() => {
    setCurrentPage(1)
  }, [sortKey, sortOrder, searchCoin])

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return displayData.slice(start, end)
  }, [displayData, currentPage])

  const getSortIcon = (key: 'price' | 'change' | 'last') => {
    if (sortKey !== key) {
      return '/images/home/normal.svg'
    }
    return sortOrder === 'asc' ? '/images/home/desc.svg' : '/images/home/asc.svg'
  }
  const formatAmount = (val: number | string | BigNumber, coinName: string) => {
    try {
      const formattedCoinName = coinName.includes('/') ? coinName.split('/')[0] : coinName
      if (!formattedCoinName) return '--'
      const str = applyTokenPrecision(getTokenPrecision(coinName), val)
      return str
    } catch {
      return '--'
    }
  }
  useEffect(() => {
    console.log(
      '：',
      data.map((d) => ({ name: d.name, spark: d.spark }))
    )
  }, [data])
  return (
    <div className="relative mx-auto flex w-full flex-col items-start gap-4 bg-[#0F0F0F] py-[44px]">
      <div className="relative mx-auto flex w-[1440px] flex-col items-start">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
          <div
            className="relative self-stretch"
            style={{ paddingBottom: '8px', display: 'flex', justifyContent: 'space-around' }}
          >
            <div className="relative flex h-[22px] w-[130px] items-center gap-1 px-0 py-2.5">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  Name
                </span>
              </div>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  Last Price
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by price" onClick={() => toggleSort('price')}>
                <Image
                  alt="Sort by price"
                  className="cursor-pointer"
                  src={getSortIcon('price')}
                  width={16}
                  height={16}
                />
              </button>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  Change
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by change" onClick={() => toggleSort('change')}>
                <Image
                  alt="Sort by change"
                  className="cursor-pointer"
                  src={getSortIcon('change')}
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  Last 24h
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by change" onClick={() => toggleSort('last')}>
                <Image
                  alt="Sort by change"
                  className="cursor-pointer"
                  src={getSortIcon('last')}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
          {pagedData.map((token) => (
            <div
              key={token.id}
              className="relative self-stretch"
              style={{ paddingBottom: '8px', display: 'flex', justifyContent: 'space-around' }}
            >
              <div className="relative flex h-[72px] w-[130px] items-center justify-between gap-[8px] self-stretch">
                <Image alt="btc" src="/images/market/btc.png" width={30} height={30} />
                <div className="relative flex flex-col items-start gap-0">
                  <div
                    className={`relative w-fit text-center font-[Inter] text-[16px] font-medium leading-normal text-[#FFF] ${token.name === 'DOGE/USDT' ? 'mr-[-11.00px]' : ''}`}
                  >
                    {token.name}
                  </div>
                  <div className="font-[Inter] text-[14px] font-normal leading-[22px] text-[#666]">Tether</div>
                </div>
              </div>
              <div className="flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-medium leading-normal text-[#FFF]">
                {formatAmount(token.price, token.name as string)}
              </div>
              <div
                className={`flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-medium leading-normal ${
                  token.change > 0 ? 'text-[#1ACA75]' : 'text-[#FF476F]'
                }`}
              >
                {token.change > 0 ? `+${token.change}%` : `${token.change}%`}
              </div>
              <div className="flex w-[130px] items-center justify-between">
                <Sparkline data={token.spark} color={token.change > 0 ? '#1ACA75' : '#FF2E65'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TokenList
