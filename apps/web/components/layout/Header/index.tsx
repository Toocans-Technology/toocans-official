'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FunctionComponent } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { useT } from '@/i18n'
import { Link } from '../../common'
import LoginButton from './LoginButton'
import SelectLanguage from './SelectLanguage'

type Props = object

const Header: FunctionComponent<Props> = () => {
  const { t } = useT('menu')

  const { isLoggedIn } = useLogin()
  const pathname = usePathname()
  const menuItems = [
    { name: 'home', path: '/' },
    { name: 'market', path: '/market' },
    { name: 'trade', path: '/trade' },
    { name: 'about', path: '/about' },
  ]

  const getActiveClass = (path: string) => {
    const normalizedPath = pathname.replace(/^\/[^/]+/, '') || '/'
    return normalizedPath === path
      ? 'font-medium text-[#9CFF1F] text-[16px] leading-[24px]'
      : 'font-medium text-[#FFF] text-[16px] leading-[24px]'
  }

  return (
    <div className="flex items-center justify-between bg-black px-8 py-5 text-white">
      <div className="flex items-center justify-between gap-[57px]">
        <Link href={isLoggedIn ? '/overview' : '/'}>
          <Image src="/images/logo.png" alt="Toocans" width={113} height={18} />
        </Link>
        <nav className="flex space-x-10">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className={getActiveClass(item.path)}>
              {t(`menu:${item.name}`)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <LoginButton />
        <SelectLanguage />
      </div>
    </div>
  )
}

export default Header
