'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import styles from '../../app/[lang]/(with-header)/overview/overview.module.scss'

export default function OverviewBalancePanel() {
  const { data: data, isLoading: assetLoading } = useAssetAll()
  const { tokens: allTokenData, isLoading: allTokenLoading } = useAllToken()
  const [show, setShow] = useState(true)
  console.log('allTokenData data1:', allTokenData)

  const formatAmount = (val: number | string) => {
    const num = Number(val)
    if (isNaN(num)) return '--'
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const availableTotal =
    Array.isArray(data) && Array.isArray(allTokenData)
      ? data
          .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
          .reduce((sum, item) => {
            const total = parseFloat(item.total ?? '0') || 0
            const price = item.tokenId === 'USDT' ? 1 : parseFloat(item.marketPrice ?? '0') || 0
            return sum + total * price
          }, 0)
      : '--'
  const total =
    Array.isArray(data) && Array.isArray(allTokenData)
      ? data
          .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
          .reduce((sum, item) => sum + (parseFloat(item.total ?? '0') || 0), 0)
      : '--'
  return (
    <div className={styles['overview-balance']}>
      <div className={styles['overview-balance-label']}>
        Total Balance
        <span onClick={() => setShow((s) => !s)} style={{ cursor: 'pointer' }}>
          <Image
            src={show ? '/images/overview/Action_Eye_Open.svg' : '/images/overview/Action_eye-close.svg'}
            alt="Assets"
            width={20}
            height={20}
          />
        </span>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div className={styles['overview-balance-panel']}>
          <div className={styles['overview-balance-value']}>
            {show && total !== '--' ? formatAmount(total) : !show && total !== '--' ? '****' : ''}
          </div>
          <div className={styles['overview-balance-usdt']}>
            USDT ≈{' '}
            {show && availableTotal !== '--'
              ? formatAmount(availableTotal)
              : !show && availableTotal !== '--'
                ? '****'
                : ''}
          </div>
        </div>
        <div className={styles['overview-balance-actions']}>
          <Link href="/deposit" className={styles['deposit-btn']}>
            Deposit
          </Link>
          <Link href="/withdrawal" className={styles['withdraw-btn']}>
            Withdraw
          </Link>
        </div>
      </div>
    </div>
  )
}
