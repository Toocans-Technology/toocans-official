'use client'

import { FunctionComponent, useState } from 'react'
import { Button } from '@workspace/ui/components'
import { Link, VerifyModal } from '@/components/common'
import { useLogin } from '@/hooks/useLogin'
import { useT } from '@/i18n'
import { useUserVerifyInfo } from '@/services/user'
import { KycLevel } from '@/types/user'
import UserDropdown from './UserDropdown'

interface Props {}

const LoginButton: FunctionComponent<Props> = () => {
  const { t } = useT('common')
  const { isLoggedIn } = useLogin()
  const { data: verifyInfo } = useUserVerifyInfo()
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const isUnverified = verifyInfo?.kycLevel === KycLevel.unverified || !verifyInfo

  return isLoggedIn ? (
    <>
      {isUnverified ? (
        <Button rounded="full" className="text-[#222]" onClick={() => setOpenVerifyModal(true)}>
          {t('common:deposit')}
        </Button>
      ) : (
        <Link href="/deposit" className="hover:opacity-80">
          <Button rounded="full" className="text-[#222]">
            {t('common:deposit')}
          </Button>
        </Link>
      )}
      <UserDropdown verifyInfo={verifyInfo} isUnverified={isUnverified} onVerifyModalOpen={setOpenVerifyModal} />
      <VerifyModal open={openVerifyModal} onOpenChange={setOpenVerifyModal} />
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
