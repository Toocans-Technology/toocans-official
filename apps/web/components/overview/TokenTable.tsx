'use client'

import Image from 'next/image'
import React from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'

const formatAmount = (val: number | string, precision: number = 4) => {
  const num = Number(val)
  if (isNaN(num)) return '--'
  return num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })
}

export default function TokenTable() {
  const { data, isLoading } = useAssetAll()
  const { tokens: allTokenResp } = useAllToken()
  const allTokenData = allTokenResp || []
  const assets = data || []

  const getTokenIcon = (tokenId: string): string | undefined => {
    if (!Array.isArray(allTokenData)) return undefined
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    if (found && typeof found.icon === 'string' && found.icon) return found.icon
    return undefined
  }

  // 获取token的最小精度
  const getTokenPrecision = (tokenId: string): number => {
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    return typeof found?.minPrecision === 'number' ? found.minPrecision : 4
  }

  return (
    <div className="mt-6 rounded-2xl bg-white p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <span className="text-[#222] font-inter text-[16px] font-medium leading-[26px]">Token</span>
        <span className="cursor-pointer flex items-center">
          <Image src="/images/overview/Navigation-order.svg" alt="Assets" width={20} height={20} />
        </span>
      </div>
      <div className="mt-[14px]">
        {assets.length === 0
          ? null
          : assets
              .filter((asset) => {
                return allTokenData.some((item) => item.tokenId === (typeof asset.tokenId === 'string' ? asset.tokenId : ''))
              })
              .sort((a, b) => {
                const aTotal = Number(a.total ?? 0) * (a.tokenId === 'USDT' ? 1 : Number(a.marketPrice ?? 0))
                const bTotal = Number(b.total ?? 0) * (b.tokenId === 'USDT' ? 1 : Number(b.marketPrice ?? 0))
                return bTotal - aTotal
              })
              .map((asset, idx) => (
                <div key={asset.id || idx} className="flex h-[76px] flex-row justify-center items-center px-6 gap-2 last:border-b-0">
                  <span className="flex items-center justify-start rounded-full bg-[#f5f5f5]">
                    {(() => {
                      const icon = getTokenIcon(typeof asset.tokenId === 'string' ? asset.tokenId : '')
                      return icon ? (
                        <Image src={icon} alt={typeof asset.tokenId === 'string' ? asset.tokenId : ''} width={30} height={30} />
                      ) : null
                    })()}
                  </span>
                  <div className="flex-1 min-w-0 h-[49px] flex flex-col justify-between">
                    <div className="text-[#0d0d0d] font-inter text-[14px] font-medium leading-[22px] font-medium">{asset.tokenId}</div>
                    <div className="text-[rgba(13,13,13,0.5)] font-din text-[12px] font-bold leading-[22px]">${asset.tokenId === 'USDT' ? '1' : formatAmount(asset.marketPrice ?? 0, 2)}</div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-[#0d0d0d] text-right font-din text-[14px] font-bold leading-[22px]">
                      {formatAmount((asset.total ?? 0), getTokenPrecision(typeof asset.tokenId === 'string' ? asset.tokenId : ''))}
                    </div>
                    <div className="text-[rgba(13,13,13,0.5)] text-right font-din text-[12px] font-bold leading-[22px]">
                      ${formatAmount(Number(asset.total ?? 0) * (asset.tokenId === 'USDT' ? 1 : Number(asset.marketPrice ?? 0)), 2)}
                    </div>
                  </div>
                </div>
              ))}
      </div>
    </div>
  )
}
