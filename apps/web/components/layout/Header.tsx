'use client'

import Image from 'next/image'
import { FunctionComponent } from 'react'
import { Button } from '@workspace/ui/components'
import { useT } from '@/i18n'
import Link from '../Link'

interface Props {
  lang: string
}

export const Header: FunctionComponent<Props> = () => {
  const { t } = useT('common')

  return (
    <div className="flex items-center justify-between bg-black px-8 py-5 text-white">
      <div className="flex items-center justify-between gap-14">
        <Image src="/images/logo.png" alt="Toocans" width={113} height={18} />
        <div className="flex flex-1 items-center justify-between gap-10">
          <Link href="/">{t('common:header.home')}</Link>
          <Link href="/market">{t('common:header.market')}</Link>
          <Link href="/trade">{t('common:header.trade')}</Link>
          <Link href="/about">{t('common:header.about')}</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/login">{t('common:loginIn')}</Link>
        <Link href="/signup">
          <Button rounded="full">{t('common:signUp')}</Button>
        </Link>
        <Image src="/icons/download.svg" alt="Download" width={24} height={24} className="cursor-pointer" />
        <Image src="/icons/intl.svg" alt="Intl" width={24} height={24} className="cursor-pointer" />
      </div>
    </div>
  )
}
