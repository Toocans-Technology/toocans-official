'use client'

import Image from 'next/image'
import { FunctionComponent, useMemo } from 'react'
import { Button } from '@workspace/ui/components'
import { useLogin } from '@/hooks/useLogin'
import { useT } from '@/i18n'
import Link from '../Link'
import UserDropdown from './UserDropdown'

interface Props {
  lang: string
}

const Header: FunctionComponent<Props> = () => {
  const { t } = useT('common')
  const { isLoggedIn } = useLogin()

  const loginInfo = useMemo(
    () =>
      isLoggedIn ? (
        <>
          <Link href="/deposit" className="hover:opacity-80">
            <Button rounded="full" className="text-[#222]">
              {t('common:deposit')}
            </Button>
          </Link>
          <UserDropdown />
        </>
      ) : (
        <>
          <Link href="/login" className="hover:opacity-80">
            {t('common:loginIn')}
          </Link>
          <Link href="/signup">
            <Button rounded="full" className="text-[#222]">
              {t('common:signUp')}
            </Button>
          </Link>
        </>
      ),
    [isLoggedIn]
  )

  return (
    <div className="flex items-center justify-between bg-black px-8 py-5 text-white">
      <div className="flex items-center justify-between gap-14">
        <Image src="/images/logo.png" alt="Toocans" width={113} height={18} />
        {/* TODO: Header menu */}
        {/* <div className="flex flex-1 items-center justify-between gap-10">
          <Link href="/" className="hover:opacity-80">
            {t('common:header.home')}
          </Link>
          <Link href="/market" className="hover:opacity-80">
            {t('common:header.market')}
          </Link>
          <Link href="/trade" className="hover:opacity-80">
            {t('common:header.trade')}
          </Link>
          <Link href="/about" className="hover:opacity-80">
            {t('common:header.about')}
          </Link>
        </div> */}
      </div>
      <div className="flex items-center gap-6">
        {loginInfo}
        <Image
          src="/icons/download.svg"
          alt="Download"
          width={24}
          height={24}
          className="cursor-pointer hover:opacity-80"
        />
        <Image src="/icons/intl.svg" alt="Intl" width={24} height={24} className="cursor-pointer hover:opacity-80" />
      </div>
    </div>
  )
}

export default Header
