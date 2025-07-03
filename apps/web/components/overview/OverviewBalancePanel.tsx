'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import BigNumber from 'bignumber.js'

export default function OverviewBalancePanel() {
  const { data: data, isLoading: assetLoading } = useAssetAll()
  const { tokens: allTokenData, isLoading: allTokenLoading } = useAllToken()
  const [show, setShow] = useState(true)

  const formatAmount = (val: number | string) => {
    try {
      const num = new BigNumber(val)
      if (!num.isFinite()) return '--'
      return num.toFormat(2)
    } catch {
      return '--'
    }
  }

  const total =
    Array.isArray(data) && Array.isArray(allTokenData)
      ? data
          .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
          .reduce((sum, item) => {
            const total = new BigNumber(item.total ?? 0)
            return sum.plus(total)
          }, new BigNumber(0))
      : '--'

  const availableTotal =
    Array.isArray(data) && Array.isArray(allTokenData)
      ? data
          .filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId))
          .reduce((sum, item) => {
            const total = new BigNumber(item.total ?? 0)
            const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.marketPrice ?? 0)
            return sum.plus(total.multipliedBy(price))
          }, new BigNumber(0))
      : '--'
  return (
    <div className="h-[154px] p-[30px_24px_10px_24px] flex flex-col gap-[10px] rounded-xl bg-white justify-center">
      <div className="flex items-center gap-2 text-[#666] font-inter text-[20px] font-normal leading-[30px] mb-2">
        Total Balance
        <span onClick={() => setShow((s) => !s)} className="cursor-pointer">
          <Image
            src={show ? '/images/overview/Action_Eye_Open.svg' : '/images/overview/Action_eye-close.svg'}
            alt="Assets"
            width={20}
            height={20}
          />
        </span>
      </div>
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex gap-2 flex-row flex-nowrap items-center">
          <div className="text-black font-inter text-[32px] font-medium leading-[30px]">
            {show && total !== '--' ? formatAmount(total) : !show && total !== '--' ? '****' : ''}
          </div>
          <div className="text-[#666] font-inter text-[14px] font-normal leading-[22px]">
            USDT ≈{' '}
            {show && availableTotal !== '--'
              ? formatAmount(availableTotal)
              : !show && availableTotal !== '--'
                ? '****'
                : ''}
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/deposit" className="flex h-10 px-7 justify-center items-center gap-2 rounded-[20px] bg-[#9cff1f] cursor-pointer text-[#222] font-inter text-[16px] font-normal leading-[22px]">
            Deposit
          </Link>
          <Link href="/withdrawal" className="flex h-10 px-7 justify-center items-center gap-2 rounded-[40px] bg-[#f4f4f4] text-[#222] font-pingfang text-[16px] font-normal leading-[22px] tracking-[-0.408px] cursor-pointer">
            Withdraw
          </Link>
        </div>
      </div>
    </div>
  )
}
