'use client'

import BigNumber from 'bignumber.js'
import Image from 'next/image'
import React from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { Link } from '../common'

const formatAmount = (val: number | string | BigNumber, precision: number = 4) => {
  try {
    const num = new BigNumber(val)
    if (!num.isFinite()) return '--'
    return num.toFormat(precision)
  } catch {
    return '--'
  }
}

function formatRateAmount(val: string | number | null | undefined, precision: number = 4) {
  const num = new BigNumber(val ?? 0)
  if (!num.isFinite()) return '--'
  return num.toFormat(precision, {
    groupSeparator: ',',
    decimalSeparator: '.',
  })
}

function safeMul(a: string | number | null | undefined, b: string | number | null | undefined) {
  const n1 = new BigNumber(a ?? 0)
  const n2 = new BigNumber(b ?? 0)
  return n1.multipliedBy(n2)
}

function formatTrailingZeros(val: string | number | null | undefined): string {
  const num = new BigNumber(val ?? 0)
  if (!num.isFinite()) return '--'
  const formatted = num.toFixed()
  const [integerPart, decimalPart] = formatted.split('.')

  if (decimalPart) {
    const trimmedDecimal = decimalPart.replace(/0+$/, '')
    return trimmedDecimal.length > 0 ? `${integerPart}.${trimmedDecimal}` : `${integerPart}.00`
  }

  return `${integerPart}`
}

const TokenTable = () => {
  const { t } = useT('overview')
  const { data } = useAssetAll()
  const { tokens: allTokenResp } = useAllToken()
  const allTokenData = allTokenResp || []
  const assets = data || []

  const getTokenIcon = (tokenId: string): string | undefined => {
    if (!Array.isArray(allTokenData)) return undefined
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    if (found && typeof found.icon === 'string' && found.icon) return found.icon
    return undefined
  }

  const getTokenPrecision = (tokenId: string, hasAsset: boolean = true): number => {
    if (!hasAsset) return 2
    const found = allTokenData.find((item) => item.tokenId === tokenId)
    return typeof found?.minPrecision === 'number' ? found.minPrecision : 4
  }

  const filteredSortedAssets = React.useMemo(() => {
    return assets.length === 0
      ? []
      : assets
          .filter((asset) => {
            return allTokenData.some(
              (item) => item.tokenId === (typeof asset.tokenId === 'string' ? asset.tokenId : '')
            )
          })
          .sort((a, b) => {
            const aTotal = safeMul(a.total ?? 0, a.tokenId === 'USDT' ? 1 : (a.marketPrice ?? 0))
            const bTotal = safeMul(b.total ?? 0, b.tokenId === 'USDT' ? 1 : (b.marketPrice ?? 0))
            return bTotal.comparedTo(aTotal) || 0
          })
  }, [assets, allTokenData])

  return (
    <div className="overflow-hidden rounded-2xl bg-white p-0 mt-[24px]">
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
                    ${asset.tokenId === 'USDT' ? '1' : formatAmount(Number(asset.marketPrice), 2)}
                    <span
                      className={`font-inter ml-2 items-center justify-center gap-2 rounded px-3 py-1 text-right text-sm font-normal leading-5 ${
                        asset.marketPriceChange != null && parseFloat(asset.marketPriceChange) < 0
                          ? 'bg-[rgba(253,99,132,0.20)] text-[#FD6384]'
                          : asset.marketPriceChange != null
                            ? `bg-[rgba(26,202,117,0.20)] text-[#1ACA75]`
                            : ''
                      }`}
                    >
                      {asset.marketPriceChange == null ? '' : parseFloat(asset.marketPriceChange).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="min-w-[80px] text-right">
                  <div className="font-din text-right text-[14px] font-bold leading-[22px] text-[#0d0d0d]">
                    {assets.length === 0
                      ? '0.00'
                      : formatTrailingZeros(
                          formatRateAmount(
                            asset.total ?? 0,
                            getTokenPrecision(
                              typeof asset.tokenId === 'string' ? asset.tokenId : '',
                              !!asset.total && asset.total !== '0'
                            )
                          )
                        )}
                  </div>
                  <div className="font-din text-right text-[12px] font-bold leading-[22px] text-[rgba(13,13,13,0.5)]">
                    $
                    {formatAmount(
                      safeMul(asset.total ?? 0, asset.tokenId === 'USDT' ? 1 : (asset.marketPrice ?? 0)).toString(),
                      2
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
