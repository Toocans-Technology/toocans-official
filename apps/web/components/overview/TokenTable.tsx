"use client"
import Image from 'next/image'
import React from 'react'
import { useAssetAll } from '@/hooks/asset'
import styles from '../../app/[lang]/(with-header)/overview/overview.module.scss'

const formatAmount = (val: number | string, precision: number = 4) => {
  const num = Number(val)
  if (isNaN(num)) return '--'
  return num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })
}

export default function TokenTable() {
  const { data } = useAssetAll()
  const assets = data || []

  return (
    <div className={styles['token-table']}>
      <div className={styles['token-table-header']}>
        <span className={styles['token-table-title']}>Token</span>
        <span className={styles['token-table-action']}>
          <Image src="/images/overview/Navigation-order.svg" alt="Assets" width={20} height={20} />
        </span>
      </div>
      <div className={styles['token-table-list']}>
        {assets.length === 0 ? null : (
          assets.map((asset, idx) => (
            <div key={asset.id || idx} className={styles['token-table-row']}>
              <span className={styles['token-icon']}>
                <Image src="/images/overview/btc.svg" alt={asset.tokenId} width={32} height={32} />
              </span>
              <div className={styles['token-info']}>
                <div className={styles['token-name']}>{asset.tokenId}</div>
                <div className={styles['token-price']}>
                  市价: {asset.tokenId === 'USDT' ? '1' : formatAmount(asset.marketPrice, 4)}
                </div>
              </div>
              <div className={styles['token-amount']}>
                <div className={styles['token-value']}>{formatAmount(asset.total, 4)}</div>
                <div className={styles['token-fiat']}>
                  ≈ {formatAmount(Number(asset.total) * (asset.tokenId === 'USDT' ? 1 : Number(asset.marketPrice)), 2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
