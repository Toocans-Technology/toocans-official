'use client'

import Image from 'next/image'
import { useId } from 'react'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { applyTokenPrecision } from '@/lib/utils'
import { useHourlyMarketPrice } from '@/services/market/hourly'
import { useMarketPrices } from '@/services/market/marketPrices'

const WS_SUBSCRIBE_MSG = {
  method: 'subscribe_live_price',
  sn: '1',
}

const TokenList: FunctionComponent = () => {
  const { t } = useT('home')

  const { mutateAsync: fetchHourlyData, data: hourlyData } = useHourlyMarketPrice()
  const { mutateAsync: fetchMarketPrices, data: marketPricesData } = useMarketPrices()

  const { getToken } = useAllToken()
  const [marketWSData, setMarketWSData] = useState<typeof marketPricesData>([])

  const data = useMemo(() => {
    return (
      marketPricesData?.map((token, i) => {
        const tokenId = token.baseToken?.toUpperCase() || ''
        const tokenIcon = getToken(tokenId)?.icon || ''
        console.log('tokenIcon:', tokenIcon, 'for tokenId:', tokenId)
        const updatedToken = marketWSData?.find(
          (updated) =>
            updated.displaySymbol?.split('/')[0]?.toUpperCase() === token.displaySymbol?.split('/')[0]?.toUpperCase()
        )
        return {
          id: token.id || `t${i + 1}`,
          name: token.displaySymbol?.toUpperCase() || '',
          icon: tokenIcon,
          quoteToken: getToken(token.displaySymbol?.split('/')[0]?.toUpperCase() || '')?.tokenFullName || '',
          price: parseFloat(updatedToken?.marketPrice || token.marketPrice || '0'),
          last: parseFloat(token.marketPrice || '0'),
          change: parseFloat(updatedToken?.marketPriceChange || token.marketPriceChange || '0'),
          spark:
            hourlyData?.[`${token.displaySymbol?.split('/')[0]?.toUpperCase()}USDT`]?.map((entry) => entry.lastPrice) ||
            Array(24).fill(0),
        }
      }) || []
    )
  }, [marketPricesData, marketWSData, getToken, hourlyData])

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_QUOTATION_WSS
    if (!wsUrl || !marketPricesData) {
      return
    }
    const ws = new window.WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(JSON.stringify(WS_SUBSCRIBE_MSG))
    }

    ws.onmessage = (event) => {
      try {
        const wsData = JSON.parse(event.data)
        const payloads = wsData.payloads
        if (Array.isArray(payloads) && marketPricesData) {
          const updatedData = [...marketPricesData]
          payloads.forEach((payload) => {
            const index = updatedData.findIndex(
              (token) => token.displaySymbol?.split('/')[0]?.toUpperCase() === payload.baseTokenId?.toUpperCase()
            )
            if (index !== -1 && updatedData[index]) {
              updatedData[index].marketPrice = payload.marketPrice
              updatedData[index].marketPriceChange = payload.marketPriceChange
            }
          })
          setMarketWSData(updatedData)
        }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err)
      }
    }

    ws.onclose = () => {
      console.log('WSS closed')
    }
    ws.onerror = (err) => {
      console.log('WSSSSmarketPricesData:', marketPricesData)
      console.error('WSS error:', err)
    }
  }, [marketPricesData])

  const Sparkline: FunctionComponent<{ data: number[]; width?: number; height?: number; color?: string }> = ({
    data,
    width = 120,
    height = 34,
    color = '#FF2E65',
  }) => {
    const gradId = useId()
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

  const filtered = useMemo(() => {
    return data.filter(() => true)
  }, [data])

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
  }, [sortKey, sortOrder])

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
      const str = applyTokenPrecision(
        marketPricesData?.find((token) => token.displaySymbol?.toUpperCase() === coinName?.toUpperCase())?.rulePairInfo,
        val
      )
      return str
    } catch (err) {
      console.error('Error formatting amount for coin:', coinName, err)
      return '--'
    }
  }
  // useEffect(() => {
  //   console.log(
  //     'data：',
  //     data.map((d) => ({ name: d.name, spark: d.spark }))
  //   )
  // }, [data])

  useEffect(() => {
    fetchMarketPrices({})
    fetchHourlyData({})
  }, [fetchMarketPrices, fetchHourlyData])

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
                  {t('home:market:Name')}
                </span>
              </div>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  {t('home:market:LastPrice')}
                </span>
              </div>
              {/* <button className="mt-1.5 h-4 w-4" aria-label="Sort by price" onClick={() => toggleSort('price')}>
                <Image
                  alt="Sort by price"
                  className="cursor-pointer"
                  src={getSortIcon('price')}
                  width={16}
                  height={16}
                />
              </button> */}
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  {t('home:market:Change')}
                </span>
              </div>
              {/* <button className="mt-1.5 h-4 w-4" aria-label="Sort by change" onClick={() => toggleSort('change')}>
                <Image
                  alt="Sort by change"
                  className="cursor-pointer"
                  src={getSortIcon('change')}
                  width={16}
                  height={16}
                />
              </button> */}
            </div>
            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#666)]">
                  {t('home:market:Last24h')}
                </span>
              </div>
              {/* <button className="mt-1.5 h-4 w-4" aria-label="Sort by change" onClick={() => toggleSort('last')}>
                <Image
                  alt="Sort by change"
                  className="cursor-pointer"
                  src={getSortIcon('last')}
                  width={16}
                  height={16}
                />
              </button> */}
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
              <div className="flex-start relative flex h-[72px] w-[130px] items-center gap-[8px] self-stretch">
                <Image
                  alt="btc"
                  src={token.icon || '/images/market/defaultCoin.png'}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="relative flex flex-col items-start gap-0">
                  <div
                    className={`relative w-fit text-center font-[Inter] text-[16px] font-medium leading-normal text-[#FFF] ${token.name === 'DOGE/USDT' ? 'mr-[-11.00px]' : ''}`}
                  >
                    {token.name}
                  </div>
                  <div className="font-[Inter] text-[14px] font-normal leading-[22px] text-[#666]">
                    {token.quoteToken}
                  </div>
                </div>
              </div>
              <div className="flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-medium leading-normal text-[#FFF]">
                {formatAmount(token.price, token.name as string)}
              </div>
              <div
                className={`flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-medium leading-normal ${
                  token.change >= 0 ? 'text-[#1ACA75]' : 'text-[#FF476F]'
                }`}
              >
                {token.change >= 0 ? `+${token.change.toFixed(2)}%` : `${token.change.toFixed(2)}%`}
              </div>
              <div className="flex w-[130px] items-center justify-between">
                <Sparkline data={token.spark} color={token.change >= 0 ? '#1ACA75' : '#FF2E65'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TokenList
