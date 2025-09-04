'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useLogin } from '@/hooks'
import { useNoLocalePathname } from '@/hooks/useNoLocalePathname'
import { useRouter } from '@/hooks/useRouter'
import { useT } from '@/i18n'
import { typedStorage, getQueryClient } from '@/lib/utils'
import { PATHNAMES } from '@/lib/utils/pathnames'

export default function Page() {
  const { t } = useT('overview')
  const [agreed, setAgreed] = useState(false)
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()

  const onNext = useCallback(() => {
    if (!agreed) return
    if (isLoggedIn) {
      // 直接退出登录
      typedStorage.clearToken()
      getQueryClient().clear()
      router.push(PATHNAMES.login)
      return
    }
    // 未登录，跳转登录并携带 from 参数，登录成功后返回
    router.push(PATHNAMES.login, { query: { from: pathname } })
  }, [agreed, isLoggedIn, pathname, router])

  return (
    <div className="flex min-h-screen justify-center bg-[#f6f6f6]">
      <div className="w-full max-w-[942px] px-8 pt-[170px]">
        <div className="flex w-[862px] flex-col items-start gap-[60px]">
          <div className="flex flex-col items-start gap-4 self-stretch text-[30px] font-medium leading-[30px] text-black [font-family:var(--sds-typography-subtitle-font-family)]">
            {t('overview:Delete Account')}
            <div className="flex flex-col items-start gap-3 self-stretch font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
              <div className="flex items-center gap-2 self-stretch">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="2" fill="#999999" />
                </svg>
                <span>
                  Your personal information and related data (e.g. history, favorites, orders) will be permanently
                  deleted and cannot be recovered.
                </span>
              </div>
              <div className="flex items-center gap-2 self-stretch">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="2" fill="#999999" />
                </svg>
                <span>You will not be able to use the services related to this account.</span>
              </div>
              <div className="flex items-center gap-2 self-stretch">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="2" fill="#999999" />
                </svg>
                <span>Before deletion, please make sure you have backed up the data you need.</span>
              </div>
            </div>
          </div>
          <div className="flex w-[529px] flex-col items-start gap-4">
            <div className="flex cursor-pointer items-center gap-2 self-stretch" onClick={() => setAgreed((a) => !a)}>
              <Image
                alt={agreed ? 'Checkbox selected' : 'Checkbox unselect'}
                src={agreed ? '/images/market/frame-2131328381.svg' : '/images/market/checkbox-unselect-4.svg'}
                width={20}
                height={20}
              />
              <span
                className="text-[14px] font-normal leading-[22px] text-[var(--light-text-secondary,#666)]"
                style={{ fontFamily: '"PingFang SC"' }}
              >
                I have read and understand that all data will not be recoverable after deletion
              </span>
            </div>
            <button
              disabled={!agreed}
              onClick={onNext}
              className="flex h-[44px] w-[182px] cursor-pointer items-center justify-center gap-[10px] rounded-[40px] bg-[#9CFF1F] px-[34px] py-[10px] font-[Inter] text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[var(--text-1,#222)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
