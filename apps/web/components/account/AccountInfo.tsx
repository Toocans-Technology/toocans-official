'use client'

import { ChevronRight, PencilLine } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, toast } from '@workspace/ui/components'
import { Separator } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useRedirectIfNotLogin, useSecurityLevel } from '@/hooks'
import { useT } from '@/i18n'
import { useUserVerifyInfo } from '@/services/user'
import { useUserInfo } from '@/services/user/info'
import { KycLevel } from '@/types/user'
import Link from '../common/Link'
import { BindEmailModal, BindPhoneModal, ChangeNicknameModal, ChangePasswordModal, ChangeAvatarModal } from './modals'
import UnbindGAModal from './modals/UnbindGAModal'

const AccountInfo: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false)
  const { data } = useUserInfo()
  const { data: verifyInfo } = useUserVerifyInfo()
  const securityLevel = useSecurityLevel(verifyInfo?.kycLevel, data?.hasGaKey)

  useRedirectIfNotLogin()

  const handleCopy = useCallback(() => {
    toast.success(t('common:copySuccess'))
  }, [])

  return (
    <div className="mt-3 w-full rounded-[10px] bg-white p-6">
      {!data?.hasGaKey && (
        <div className="mb-5 rounded-md bg-[#FFF3A5] p-4">
          <p className="text-xs">{t('account:lowSecurityDescription')}</p>
          <Link href="/authapp" className="mt-2 inline-flex cursor-pointer items-center gap-2">
            <span className="text-sm">{t('account:google2fa')}</span>
            <ChevronRight color="#666" size={16} />
          </Link>
        </div>
      )}
      <div className="grid grid-cols-3 py-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer" onClick={() => setOpenChangeAvatarModal(true)}>
            <Image
              src={data?.avatar || '/images/avatar.png'}
              alt="User"
              width={36}
              height={36}
              className="max-h-9 rounded"
            />
            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EBEBEB]">
              <PencilLine color="#222" size={8} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h2>{data?.nickname}</h2>
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
            <span
              className={cn(
                'inline-block rounded px-2 py-0.5 text-xs',
                verifyInfo?.kycLevel === KycLevel.low ? 'bg-brand/20 text-brand' : 'bg-destructive/20 text-destructive'
              )}
            >
              {verifyInfo?.kycLevel === KycLevel.low ? t('common:verified') : t('common:unverified')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[#666]">{t('account:securityLevel')}</p>
          <span className="text-sm">{securityLevel}</span>
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
          {data?.hasGaKey ? (
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
      <ChangeAvatarModal open={openChangeAvatarModal} onOpenChange={setOpenChangeAvatarModal} />
    </div>
  )
}

export default AccountInfo
