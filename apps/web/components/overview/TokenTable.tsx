import React from 'react'
import { getT } from '@/i18n/server'
import Image from 'next/image'
import styles from './TokenTable.module.scss'

interface Token {
  icon: string // 图片路径
  name: string
  price: string
  amount: string
  value: string
  iconBg?: string // 这里不再用，背景色统一由scss控制
}

const tokens: Token[] = [
  {
    icon: '/images/overview/btc.svg',
    name: 'BTC',
    price: '$67,725.90',
    amount: '1.00',
    value: '$67,725.90',
  },
  {
    icon: '/images/overview/btc.svg',
    name: 'USDT',
    price: '$1.00',
    amount: '0',
    value: '$0',
  },
  {
    icon: '/images/overview/btc.svg',
    name: 'USDT',
    price: '$3725.00',
    amount: '2.00',
    value: '$7450.00',
  },
]

export default async function TokenTable({ lang }: { lang: string }) {
  const { t } = await getT(lang, 'overview')
  return (
    <div className={styles['token-table']}>
      <div className={styles['token-table-header']}>
        <span className={styles['token-table-title']}>Token</span>
        <span className={styles['token-table-action']}>
          <Image src="/images/overview/Navigation-order.svg" alt="Assets" width={20} height={20} />
        </span>
      </div>
      <div className={styles['token-table-list']}>
        {tokens.map((token, idx) => (
          <div key={idx} className={styles['token-table-row']}>
            <span className={styles['token-icon']}>
              <img src={token.icon} alt={token.name} />
            </span>
            <div className={styles['token-info']}>
              <div className={styles['token-name']}>{token.name}</div>
              <div className={styles['token-price']}>{token.price}</div>
            </div>
            <div className={styles['token-amount']}>
              <div className={styles['token-value']}>{token.amount}</div>
              <div className={styles['token-fiat']}>{token.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
