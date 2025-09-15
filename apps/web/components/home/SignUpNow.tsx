'use client'

import { FunctionComponent } from 'react'
import { Button } from '@workspace/ui/components'
import { useLogin } from '@/hooks'
import { useT } from '@/i18n'
import Link from '../common/Link'

const SignUpNow: FunctionComponent = () => {
  const { t } = useT(['home'])
  const { isLoggedIn } = useLogin()

  if (isLoggedIn) return null

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[762px] flex-col items-center px-6 pb-10 pt-14 text-white lg:px-8">
        <h1 className="text-center text-[32px] text-[#f6f6f6]">{t('home:signUpNowDescription')}</h1>
        <Link href="/login" className="mt-8">
          <Button className="text-[#222]" rounded="full">
            {t('home:signUpNow')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SignUpNow
