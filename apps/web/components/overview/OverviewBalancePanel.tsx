'use client'

import BigNumber from 'bignumber.js'
import { sumBy } from 'es-toolkit'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Button } from '@workspace/ui/components'
import { useRedirectIfNotLogin } from '@/hooks'
import { useAssetAll } from '@/hooks/asset'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { applyTokenPrecision } from '@/lib/utils'
import { typedStorage } from '@/lib/utils/typedStorage/index'
import type { GetAllAssetResponse } from '@/services/asset/useGetAllAsset'
import { useUserVerifyInfo } from '@/services/user'
import { KycLevel } from '@/types/user'
import { Link, VerifyModal } from '../common'

export default function OverviewBalancePanel() {
  const { t } = useT('overview')
  const { data: data } = useAssetAll()
  const { tokens: allTokenData, getTokenPrecision } = useAllToken()
  const { data: verifyInfo } = useUserVerifyInfo()
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const isUnverified = verifyInfo?.kycLevel === KycLevel.unverified || !verifyInfo

  const [show, setShow] = useState<boolean>(() => {
    return typedStorage.hideAssets
  })
  useRedirectIfNotLogin()

  const handleToggleShow = () => {
    setShow((prev: boolean) => {
      const newValue = !prev
      typedStorage.hideAssets = newValue
      return newValue
    })
  }

  const formatUsdtAmount = (val: number | string | BigNumber) => {
    try {
      const str = applyTokenPrecision(getTokenPrecision('USDT'), val)
      return str
    } catch {
      return '--'
    }
  }

  const total = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return '--'
    return sumBy(
      (data as GetAllAssetResponse).filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId)),
      (item) => {
        const total = new BigNumber(item.total ?? 0)
        const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.marketPrice ?? 0)
        return total.multipliedBy(price).toNumber()
      }
    )
  }, [data, allTokenData])

  const availableTotal = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return '--'
    return sumBy(
      (data as GetAllAssetResponse).filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId)),
      (item) => {
        const total = new BigNumber(item.total ?? 0)
        const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.marketPrice ?? 0)
        return total.multipliedBy(price).toNumber()
      }
    )
  }, [data, allTokenData])

  return (
    <div
      className="flex flex-col justify-center gap-[24px] rounded-xl bg-white p-[30px_24px_30px_24px]"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div className="flex flex-row flex-nowrap justify-between">
        <div className="font-inter flex items-center gap-2 text-[20px] font-normal leading-[30px] text-[#666]">
          {t('overview:TotalBalance')}
          <span onClick={handleToggleShow} className="cursor-pointer">
            <Image
              src={show ? '/images/overview/Action_Eye_Open.svg' : '/images/overview/Action_eye-close.svg'}
              alt="Assets"
              width={20}
              height={20}
            />
          </span>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row flex-nowrap items-center gap-2">
          <div className="font-inter text-[32px] font-medium leading-[30px] text-black">
            {show && total !== '--' ? BigNumber(total).toFixed(2) : !show && total !== '--' ? '****' : ''}
          </div>
          <div className="font-inter text-[14px] font-normal leading-[22px] text-[#666]">
            USDT ≈{' '}
            {show && availableTotal !== '--'
              ? '$' + BigNumber(availableTotal).toFixed(2)
              : !show && availableTotal !== '--'
                ? '****'
                : ''}
          </div>
        </div>
        <div className="flex gap-3">
          {isUnverified ? (
            <>
              <Button
                rounded="full"
                className="px-7 text-[16px] font-normal leading-[22px]"
                onClick={() => setOpenVerifyModal(true)}
              >
                {t('overview:Deposit')}
              </Button>
              <Button
                rounded="full"
                variant="secondary"
                className="px-7 text-[16px] font-normal leading-[22px]"
                onClick={() => setOpenVerifyModal(true)}
              >
                {t('overview:Withdraw')}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/deposit"
                className="font-inter flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-[#9cff1f] px-7 text-[16px] font-normal leading-[22px] text-[#222]"
              >
                {t('overview:Deposit')}
              </Link>
              <Link
                href="/withdrawal"
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[40px] bg-[#f4f4f4] px-7 text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[#222]"
              >
                {t('overview:Withdraw')}
              </Link>
            </>
          )}
        </div>
      </div>
      {isUnverified && <VerifyModal open={openVerifyModal} onOpenChange={setOpenVerifyModal} />}
    </div>
  )
}
