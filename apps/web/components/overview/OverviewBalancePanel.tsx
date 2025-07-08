'use client'

import BigNumber from 'bignumber.js'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'

export default function OverviewBalancePanel() {
  const { t } = useT('overview')
  const { data: data } = useAssetAll()
  const { tokens: allTokenData } = useAllToken()
  const [show, setShow] = useState(true)

  const formatAmount = (val: number | string | BigNumber) => {
    try {
      const num = new BigNumber(val)
      if (!num.isFinite()) return '--'
      return num.toFormat(2)
    } catch {
      return '--'
    }
  }

  const total = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return '--'
    return data
      .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
      .reduce((sum, item) => {
        const total = new BigNumber(item.total ?? 0)
        return sum.plus(total)
      }, new BigNumber(0))
  }, [data, allTokenData])

  const availableTotal = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return '--'
    return data
      .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
      .reduce((sum, item) => {
        const total = new BigNumber(item.total ?? 0)
        const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.marketPrice ?? 0)
        return sum.plus(total.multipliedBy(price))
      }, new BigNumber(0))
  }, [data, allTokenData])

  const availableBalance = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return '--'
    return data
      .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
      .reduce((sum, item) => {
        const total = new BigNumber(item.total ?? 0)
        const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.availableAssetTotal ?? 0)
        return sum.plus(total.multipliedBy(price))
      }, new BigNumber(0))
  }, [data, allTokenData])
  return (
    <div className="flex h-[154px] flex-col justify-center gap-[10px] rounded-xl bg-white p-[30px_24px_10px_24px]">
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="font-inter mb-2 flex items-center gap-2 text-[20px] font-normal leading-[30px] text-[#666]">
          {t('overview:TotalBalance')}
          <span onClick={() => setShow((s) => !s)} className="cursor-pointer">
            <Image
              src={show ? '/images/overview/Action_Eye_Open.svg' : '/images/overview/Action_eye-close.svg'}
              alt="Assets"
              width={20}
              height={20}
            />
          </span>
        </div>
        <div className="font-inter mb-2 flex items-center justify-end gap-2 text-[20px] font-normal leading-[30px] text-[#666]">
          {t('overview:AvailableBalance')}
          <div>
            {' '}
            {show && availableBalance !== '--'
              ? formatAmount(availableBalance)
              : !show && availableBalance !== '--'
                ? '****'
                : ''}{' '}
            USDT
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row flex-nowrap items-center gap-2">
          <div className="font-inter text-[32px] font-medium leading-[30px] text-black">
            {show && total !== '--' ? formatAmount(total) : !show && total !== '--' ? '****' : ''}
          </div>
          <div className="font-inter text-[14px] font-normal leading-[22px] text-[#666]">
            USDT ≈{' '}
            {show && availableTotal !== '--'
              ? formatAmount(availableTotal)
              : !show && availableTotal !== '--'
                ? '****'
                : ''}
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/deposit"
            className="font-inter flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-[#9cff1f] px-7 text-[16px] font-normal leading-[22px] text-[#222]"
          >
            {t('overview:Deposit')}
          </Link>
          <Link
            href="/withdrawal"
            className="font-pingfang flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[40px] bg-[#f4f4f4] px-7 text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[#222]"
          >
            {t('overview:Withdraw')}
          </Link>
        </div>
      </div>
    </div>
  )
}
