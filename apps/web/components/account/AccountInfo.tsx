'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, toast } from '@workspace/ui/components'
import { Separator } from '@workspace/ui/components'
import { useSecurityLevel } from '@/hooks'
import { useT } from '@/i18n'
import { useUserInfo } from '@/services/user/info'
import { KycLevel } from '@/types/user'
import Link from '../Link'
import { BindEmailModal, BindPhoneModal, ChangeNicknameModal, ChangePasswordModal } from './modals'
import UnbindGAModal from './modals/UnbindGAModal'

const AccountInfo: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const { data } = useUserInfo()
  const kycLevel = useSecurityLevel(data?.kycLevel)

  const handleCopy = useCallback(() => {
    toast.success(t('common:copySuccess'))
  }, [])

  return (
    <div className="mt-5 w-full rounded-[10px] bg-white p-6">
      {!data?.hasGaKey && (
        <div className="rounded-md bg-[#FFF3A5] p-4">
          <p className="text-xs">{t('account:lowSecurityDescription')}</p>
          <Link href="/authapp" className="mt-2 inline-flex cursor-pointer items-center gap-2">
            <span className="text-sm">{t('account:google2fa')}</span>
            <ChevronRight color="#666" size={16} />
          </Link>
        </div>
      )}
      <div className="mt-5 grid grid-cols-3 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Image src={data?.avatar || '/icons/user.svg'} alt="User" width={28} height={28} className="size-7 rounded" />
          <div className="flex flex-col gap-1">
            <h2>{data?.loginName}</h2>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span>UID: {data?.userId}</span>
              <CopyToClipboard text={data?.userId || ''} onCopy={handleCopy}>
                <Button variant="ghost" size="icon" className="size-5" rounded="sm">
                  <Image src="/icons/copy.svg" alt="copy" width={16} height={16} />
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[#666]">{t('account:identityVerification')}</p>
          <div>
            <span className="bg-destructive/20 text-destructive inline-block rounded px-2 py-0.5 text-sm">
              {data?.kycLevel === KycLevel.unverified ? t('account:unverified') : t('account:verified')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[#666]">{t('account:securityLevel')}</p>
          <span className="text-sm">{kycLevel}</span>
        </div>
      </div>
      <Separator />
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="text-sm">{t('account:nickName')}</div>
        <div className="text-xs">{data?.nickname}</div>
        <div className="flex justify-end">
          <ChangeNicknameModal />
        </div>
      </div>
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="text-sm">{t('account:userId')}</div>
        <div className="text-xs">{data?.userId}</div>
        <div className="flex justify-end">
          <CopyToClipboard text={data?.userId || ''} onCopy={handleCopy}>
            <Button rounded="full" variant="secondary">
              {t('common:copy')}
            </Button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="flex flex-col gap-1 text-sm">
          <p>{t('account:emailAuth')}</p>
          <p className="text-[#666]">{t('account:emailAuthDescription')}</p>
        </div>
        <div className="text-xs">{data?.email}</div>
        <div className="flex justify-end">
          {data?.email ? (
            <CopyToClipboard text={data?.email || ''} onCopy={handleCopy}>
              <Button rounded="full" variant="secondary">
                {t('common:copy')}
              </Button>
            </CopyToClipboard>
          ) : (
            <BindEmailModal />
          )}
        </div>
      </div>
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="flex flex-col gap-1 text-sm">
          <p>{t('account:phoneAuth')}</p>
          <p className="text-[#666]">{t('account:phoneAuthDescription')}</p>
        </div>
        <div className="text-xs">{data?.mobile ? `+${data?.nationalCode}${data?.mobile}` : '-'}</div>
        <div className="flex justify-end">
          {data?.mobile ? (
            <CopyToClipboard text={data?.mobile || ''} onCopy={handleCopy}>
              <Button rounded="full" variant="secondary">
                {t('common:copy')}
              </Button>
            </CopyToClipboard>
          ) : (
            <BindPhoneModal />
          )}
        </div>
      </div>
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="flex text-sm">
          <p>{t('account:loginPassword')}</p>
        </div>
        <div className="text-xs">{data?.setPassword ? '******' : t('account:notConfigured')}</div>
        <div className="flex justify-end">
          <ChangePasswordModal />
        </div>
      </div>
      <div className="my-3 grid grid-cols-3 items-center py-3">
        <div className="flex flex-col gap-1 text-sm">
          <p>{t('account:authenticationApp')}</p>
          <p className="text-[#666]">{t('account:authenticationAppDescription')}</p>
        </div>
        <div className="text-xs">{data?.hasGaKey ? '' : t('account:notConfigured')}</div>
        <div className="flex justify-end">
          {!data?.hasGaKey ? (
            <UnbindGAModal />
          ) : (
            <Link href="/authapp">
              <Button rounded="full" variant="secondary">
                {t('common:settings')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountInfo
