'use client'

import Image from 'next/image'
import React from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import styles from '../../app/[lang]/(with-header)/overview/overview.module.scss'

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
    <div className={styles['token-table']}>
      <div className={styles['token-table-header']}>
        <span className={styles['token-table-title']}>Token</span>
        <span className={styles['token-table-action']}>
          <Image src="/images/overview/Navigation-order.svg" alt="Assets" width={20} height={20} />
        </span>
      </div>
      <div className={styles['token-table-list']}>
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
                <div key={asset.id || idx} className={styles['token-table-row']}>
                  <span className={styles['token-icon']}>
                    {(() => {
                      const icon = getTokenIcon(typeof asset.tokenId === 'string' ? asset.tokenId : '')
                      return icon ? (
                        <Image src={icon} alt={typeof asset.tokenId === 'string' ? asset.tokenId : ''} width={32} height={32} />
                      ) : null
                    })()}
                  </span>
                  <div className={styles['token-info']}>
                    <div className={styles['token-name']}>{asset.tokenId}</div>
                    <div className={styles['token-price']}>
                      市价: {asset.tokenId === 'USDT' ? '1' : formatAmount(asset.marketPrice ?? 0, 4)}
                    </div>
                  </div>
                  <div className={styles['token-amount']}>
                    <div className={styles['token-value']}>
                      {formatAmount((asset.total ?? 0), getTokenPrecision(typeof asset.tokenId === 'string' ? asset.tokenId : ''))}
                    </div>
                    <div className={styles['token-fiat']}>
                      ≈ {formatAmount(Number(asset.total ?? 0) * (asset.tokenId === 'USDT' ? 1 : Number(asset.marketPrice ?? 0)), 2)}
                    </div>
                  </div>
                </div>
              ))}
      </div>
    </div>
  )
}
