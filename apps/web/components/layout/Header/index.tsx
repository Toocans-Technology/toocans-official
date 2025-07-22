'use client'

import Image from 'next/image'
import { FunctionComponent } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { Link } from '../../common'
import LoginButton from './LoginButton'
import SelectLanguage from './SelectLanguage'

interface Props {}

const Header: FunctionComponent<Props> = () => {
  const { isLoggedIn } = useLogin()

  return (
    <div className="flex items-center justify-between bg-black px-8 py-5 text-white">
      <div className="flex items-center justify-between gap-14">
        <Link href={isLoggedIn ? '/overview' : '/'}>
          <Image src="/images/logo.png" alt="Toocans" width={113} height={18} />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <LoginButton />
        <Image
          src="/icons/download.svg"
          alt="Download"
          width={24}
          height={24}
          className="cursor-pointer hover:opacity-80"
        />
        <SelectLanguage />
      </div>
    </div>
  )
}

export default Header
