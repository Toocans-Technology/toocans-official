'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Input } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { Link, VerifyModal } from '@/components/common'
import { useAllToken, useLogin } from '@/hooks'
import { useTotalBalance } from '@/hooks/useTotalBalance'
import { useT } from '@/i18n'
import { applyTokenPrecision, formatByPrecision } from '@/lib/utils'
import { useUserVerifyInfo } from '@/services/user'
import { KycLevel } from '@/types/user'

const HeroSection: FunctionComponent = () => {
  const { t } = useT(['home', 'common'])
  const router = useRouter()
  const { isLoggedIn } = useLogin()
  const [email, setEmail] = useState('')
  const { totalBalance } = useTotalBalance()
  const { getTokenPrecision } = useAllToken()
  const { data: verifyInfo } = useUserVerifyInfo()
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const isUnverified = verifyInfo?.kycLevel === KycLevel.unverified || !verifyInfo

  const usdtTokenPrecision = getTokenPrecision('USDT')

  const handleStartNow = useCallback(() => {
    router.push(`/login?email=${email}`)
  }, [router, email])

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-16 text-white">
        <div className={cn('inline-flex flex-col', isLoggedIn ? 'gap-6' : 'gap-10')}>
          <p className="max-w-[560px] text-[40px]">{t('home:hero.description')}</p>
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <div>
                <p className="text-sm text-[#999]">{t('home:totalBalance')}</p>
                <div className="mt-2 flex items-baseline gap-2 font-medium text-white">
                  <span className="text-[40px]">
                    {applyTokenPrecision(usdtTokenPrecision, totalBalance, {
                      useThousandSeparator: true,
                    })}
                  </span>
                  <span className="text-sm">USDT ≈ ${formatByPrecision(totalBalance, usdtTokenPrecision)}</span>
                </div>
                {isUnverified ? (
                  <Button className="mt-4" rounded="full" onClick={() => setOpenVerifyModal(true)}>
                    {t('common:deposit')}
                  </Button>
                ) : (
                  <Link href="/deposit" className="mt-4">
                    <Button className="mt-4" rounded="full">
                      {t('common:deposit')}
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="flex max-w-80 items-center rounded-full border border-[#666] p-1">
                  <Input
                    value={email}
                    placeholder={t('home:hero.inputPlaceholder')}
                    className="h-9 border-none bg-transparent hover:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button rounded="full" className="text-[#222]" onClick={handleStartNow}>
                    {t('home:startNow')}
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[#999]">{t('home:continueWith')}</p>
            <div className="mt-2 flex gap-3">
              <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#4E4E4E]">
                <Image src="/images/home/google.svg" alt="Google" width={16} height={16} />
              </Link>
              <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#4E4E4E]">
                <Image src="/images/home/app-store.svg" alt="Apple" width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Image src="/images/home/home-bitcoin.png" alt="Bitcoin" width={290} height={314} />
        </div>
      </div>
      <VerifyModal open={openVerifyModal} onOpenChange={setOpenVerifyModal} />
    </div>
  )
}

export default HeroSection
