'use client'

import { FunctionComponent } from 'react'
import { Button } from '@workspace/ui/components'
import { useLogin } from '@/hooks/useLogin'
import { useT } from '@/i18n'
import { Link } from '../../common'
import UserDropdown from './UserDropdown'

interface Props {}

const LoginButton: FunctionComponent<Props> = () => {
  const { t } = useT('common')
  const { isLoggedIn } = useLogin()

  return isLoggedIn ? (
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
      <Link href="/login" className="text-white hover:opacity-80">
        {t('common:loginIn')}
      </Link>
      <Link href="/login">
        <Button rounded="full" className="text-[#222]">
          {t('common:signUp')}
        </Button>
      </Link>
    </>
  )
}

export default LoginButton
