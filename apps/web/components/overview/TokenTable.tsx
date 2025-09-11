'use client'

import BigNumber from 'bignumber.js'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { applyTokenPrecision } from '@/lib/utils'
import type { TokenPrecisionAutoVO } from '@/lib/utils/formatTokenPrecision'
import { useMarketPrices, type MarketPricesResponse } from '@/services/market/marketPrices'
import { Link } from '../common'

function safeMul(a: string | number | null | undefined, b: string | number | null | undefined) {
  const n1 = new BigNumber(a ?? 0)
  const n2 = new BigNumber(b ?? 0)
  return n1.multipliedBy(n2)
}
const WS_SUBSCRIBE_MSG = { method: 'subscribe_live_price', sn: '1' }

interface WsPricePayload {
  baseTokenId?: string
  marketPrice?: string
  marketPriceChange?: string
}

const TokenTable = () => {
  const { t } = useT('overview')
  const { data } = useAssetAll()
  const { tokens: allTokenResp } = useAllToken()
  const { mutateAsync: fetchMarketPrices } = useMarketPrices()
  const [marketPrices, setMarketPrices] = useState<MarketPricesResponse | undefined>(undefined)

  useEffect(() => {
    let mounted = true
    fetchMarketPrices({})
      .then((res) => {
        if (!mounted) return
        if (Array.isArray(res)) {
          setMarketPrices(res)
          setLivePrices((prev) => {
            const next = { ...prev }
            res.forEach((item) => {
              const base = item.baseToken?.toUpperCase?.()
              if (!base) return
              next[base] = {
                price: item.marketPrice ?? prev[base]?.price ?? null,
                change: item.marketPriceChange ?? prev[base]?.change ?? null,
              }
            })
            return next
          })
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [fetchMarketPrices])

  const allTokenData = useMemo(() => allTokenResp || [], [allTokenResp])
  const assets = useMemo(() => data || [], [data])

  const getTokenIcon = (tokenId: string): string | undefined => {
    if (!Array.isArray(allTokenData)) return undefined
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    if (found && typeof found.icon === 'string' && found.icon) return found.icon
    return undefined
  }
  const formatAmount = (val: number | string | BigNumber, tokenId?: string | null) => {
    try {
      const upper = tokenId?.toUpperCase?.()
      const rule = upper ? marketPriceRuleMap[upper] : undefined
      return applyTokenPrecision(rule, val, { fallbackDigits: 4 })
    } catch {
      return '--'
    }
  }

  const [livePrices, setLivePrices] = useState<Record<string, { price: string | null; change: string | null }>>({})

  const marketPriceRuleMap = useMemo(() => {
    const map: Record<string, TokenPrecisionAutoVO | null | undefined> = {}
    if (Array.isArray(marketPrices)) {
      marketPrices.forEach((item) => {
        const base = item.baseToken?.toUpperCase?.()
        if (base) map[base] = item.rulePairInfo
      })
    }
    return map
  }, [marketPrices])

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_QUOTATION_WSS
    if (!wsUrl) return
    const ws = new window.WebSocket(wsUrl)
    let closed = false
    ws.onopen = () => {
      ws.send(JSON.stringify(WS_SUBSCRIBE_MSG))
    }
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        const payloads = parsed?.payloads
        if (Array.isArray(payloads)) {
          setLivePrices((prev) => {
            const next = { ...prev }
            payloads.forEach((p: WsPricePayload) => {
              const base = p.baseTokenId?.toUpperCase?.()
              if (!base) return
              next[base] = {
                price: p.marketPrice ?? prev[base]?.price ?? null,
                change: p.marketPriceChange ?? prev[base]?.change ?? null,
              }
            })
            return next
          })
        }
      } catch {
        // ignore parse error
      }
    }
    ws.onerror = () => {}
    ws.onclose = () => {
      closed = true
    }
    return () => {
      if (!closed) ws.close()
    }
  }, [])

  const filteredSortedAssets = useMemo(() => {
    return assets.length === 0
      ? []
      : assets
          .filter((asset) => {
            return allTokenData.some(
              (item) => item.tokenId === (typeof asset.tokenId === 'string' ? asset.tokenId : '')
            )
          })
          .sort((a, b) => {
            const aLive =
              a.tokenId === 'USDT'
                ? 1
                : (livePrices[(a.tokenId as string)?.toUpperCase?.()]?.price ?? a.marketPrice ?? 0)
            const bLive =
              b.tokenId === 'USDT'
                ? 1
                : (livePrices[(b.tokenId as string)?.toUpperCase?.()]?.price ?? b.marketPrice ?? 0)
            const aTotal = safeMul(a.total ?? 0, aLive)
            const bTotal = safeMul(b.total ?? 0, bLive)
            return bTotal.comparedTo(aTotal) || 0
          })
  }, [assets, allTokenData, livePrices])

  return (
    <div className="mt-4 overflow-hidden rounded-2xl bg-white p-0">
      <div className="flex items-center justify-between px-6 pb-2 pt-6">
        <span className="font-inter text-[16px] font-medium leading-[26px] text-[#222]">{t('overview:Token')}</span>
        <Link href="/history" className="cursor-pointer">
          <Image src="/images/overview/Navigation-order.svg" alt="Assets" width={20} height={20} />
        </Link>
      </div>
      <hr style={{ strokeWidth: '1px', stroke: 'var(--light-divider, #F4F4F4)' }} />
      <div>
        {filteredSortedAssets.length === 0
          ? null
          : filteredSortedAssets.map((asset, idx) => (
              <div
                key={asset.id || idx}
                className="mt-[14px] flex h-[76px] flex-row items-center justify-center gap-2 border-b px-6 first:mt-0 last:border-b-0"
              >
                <span className="flex items-center justify-start rounded-full bg-[#f5f5f5]">
                  {(() => {
                    const icon = getTokenIcon(typeof asset.tokenId === 'string' ? asset.tokenId : '')
                    return icon ? (
                      <Image
                        src={icon}
                        alt={typeof asset.tokenId === 'string' ? asset.tokenId : ''}
                        width={30}
                        height={30}
                      />
                    ) : (
                      <Image
                        src={'/images/overview/default.svg'}
                        alt={typeof asset.tokenId === 'string' ? asset.tokenId : ''}
                        width={30}
                        height={30}
                      />
                    )
                  })()}
                </span>
                <div className="flex h-[49px] min-w-0 flex-1 flex-col justify-between">
                  <div className="font-inter text-[14px] font-medium leading-[22px] text-[#0d0d0d]">
                    {asset.tokenId}
                  </div>
                  <div className="font-din text-[12px] font-bold leading-[22px] text-[rgba(13,13,13,0.5)]">
                    $
                    {(() => {
                      if (asset.tokenId === 'USDT') return '1.00'
                      const upper = (asset.tokenId as string)?.toUpperCase?.()
                      const price = livePrices[upper]?.price ?? asset.marketPrice ?? 0
                      const rule = marketPriceRuleMap[upper] // rulePairInfo
                      try {
                        return applyTokenPrecision(rule, price, { fallbackDigits: 4 })
                      } catch {
                        return '0'
                      }
                    })()}
                    <span
                      className={`font-inter ml-2 items-center justify-center gap-2 rounded px-3 py-1 text-right text-sm font-normal leading-5 ${(() => {
                        const ch =
                          livePrices[(asset.tokenId as string)?.toUpperCase?.()]?.change ?? asset.marketPriceChange
                        if (ch == null) return ''
                        const num = parseFloat(ch)
                        if (isNaN(num)) return ''
                        if (num < 0) return 'bg-[rgba(253,99,132,0.20)] text-[#FD6384]'
                        return 'bg-[rgba(26,202,117,0.20)] text-[#1ACA75]'
                      })()}`}
                    >
                      {(() => {
                        const ch =
                          livePrices[(asset.tokenId as string)?.toUpperCase?.()]?.change ?? asset.marketPriceChange
                        if (ch == null) return ''
                        const num = parseFloat(ch)
                        if (isNaN(num)) return ''
                        return num.toFixed(2)
                      })()}
                      %
                    </span>
                  </div>
                </div>
                <div className="min-w-[80px] text-right">
                  <div className="font-din text-right text-[14px] font-bold leading-[22px] text-[#0d0d0d]">
                    {assets.length === 0 ? '0.00' : formatAmount(asset.total ?? 0, asset.tokenId as string)}
                  </div>
                  <div className="font-din text-right text-[12px] font-bold leading-[22px] text-[rgba(13,13,13,0.5)]">
                    $
                    {(() => {
                      try {
                        const totalUSD = safeMul(
                          asset.total ?? 0,
                          asset.tokenId === 'USDT'
                            ? 1
                            : (livePrices[(asset.tokenId as string)?.toUpperCase?.()]?.price ?? asset.marketPrice ?? 0)
                        )
                        const fixed = totalUSD.toFixed(2)
                        if (!isFinite(Number(fixed))) return '--'
                        return fixed
                      } catch {
                        return '--'
                      }
                    })()}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default TokenTable
