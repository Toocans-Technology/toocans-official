"use client"
import Image from 'next/image'
import React from 'react'
import { useAssetAll } from '@/hooks/asset'
import styles from './TokenTable.module.scss'

const formatAmount = (val: number | string) => {
  const num = Number(val)
  if (isNaN(num)) return '--'
  return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })
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
                <div className={styles['token-price']}>市价: {formatAmount(asset.marketPrice)}</div>
              </div>
              <div className={styles['token-amount']}>
                <div className={styles['token-value']}>{formatAmount(asset.total)}</div>
                <div className={styles['token-fiat']}>≈ {formatAmount(asset.availableAssetTotal)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
