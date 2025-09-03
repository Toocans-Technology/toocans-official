'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Input } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { EMAIL_REGEX } from '@/lib/utils/constants'
import Link from '../common/Link'

const HeroSection: FunctionComponent = () => {
  const { t } = useT(['home'])
  const router = useRouter()
  const [isValid, setIsValid] = useState(false)
  const [email, setEmail] = useState('')

  const validateEmail = useCallback((email: string) => {
    const isValid = EMAIL_REGEX.test(email)
    setEmail(email)
    setIsValid(isValid)
  }, [])

  const handleStartNow = useCallback(() => {
    if (isValid) {
      router.push(`/login?email=${email}`)
    }
  }, [isValid, router, email])

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-16 text-white">
        <div className="inline-flex flex-col gap-10">
          <p className="max-w-[560px] text-[40px]">{t('home:hero.description')}</p>
          <div className="flex flex-col gap-2">
            <div className="flex max-w-80 items-center rounded-full border border-[#666] p-1">
              <Input
                value={email}
                placeholder={t('home:hero.inputPlaceholder')}
                className="h-9 border-none bg-transparent focus-visible:outline-none focus-visible:ring-0"
                onChange={(e) => validateEmail(e.target.value)}
              />
              <Button rounded="full" className="text-[#222]" onClick={handleStartNow}>
                {t('home:startNow')}
              </Button>
            </div>
            {!isValid && <p className="text-destructive">{t('home:invalidEmail')}</p>}
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
    </div>
  )
}

export default HeroSection
