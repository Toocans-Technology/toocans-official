'use client'

import BigNumber from 'bignumber.js'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { applyTokenPrecision } from '@/lib/utils'
import { Link } from '../common'

function safeMul(a: string | number | null | undefined, b: string | number | null | undefined) {
  const n1 = new BigNumber(a ?? 0)
  const n2 = new BigNumber(b ?? 0)
  return n1.multipliedBy(n2)
}
const WS_SUBSCRIBE_MSG = { method: 'subscribe_live_price', sn: '1' }

const TokenTable = () => {
  const { t } = useT('overview')
  const { data } = useAssetAll()
  const { tokens: allTokenResp, getTokenPrecision } = useAllToken()
  const allTokenData = allTokenResp || []
  const assets = data || []

  const getTokenIcon = (tokenId: string): string | undefined => {
    if (!Array.isArray(allTokenData)) return undefined
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    if (found && typeof found.icon === 'string' && found.icon) return found.icon
    return undefined
  }
  const formatAmount = (val: number | string | BigNumber, coinName: string) => {
    try {
      const str = applyTokenPrecision(getTokenPrecision(coinName), val)
      return str
    } catch {
      return '--'
    }
  }
 
  const [livePrices, setLivePrices] = useState<Record<string, { price: string | null; change: string | null }>>({})

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
            payloads.forEach((p: any) => {
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
      } catch (e) {
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
                    {asset.tokenId === 'USDT'
                      ? '1.00'
                      : formatAmount(
                          Number(
                            livePrices[(asset.tokenId as string)?.toUpperCase?.()]?.price ?? asset.marketPrice ?? 0
                          ),
                          asset.tokenId as string
                        )}
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
                    {formatAmount(
                      safeMul(
                        asset.total ?? 0,
                        asset.tokenId === 'USDT'
                          ? 1
                          : (livePrices[(asset.tokenId as string)?.toUpperCase?.()]?.price ?? asset.marketPrice ?? 0)
                      ).toString(),
                      'USDT'
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default TokenTable
