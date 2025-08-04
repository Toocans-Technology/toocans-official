'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { useForgetContext } from '@/components/forget/ForgetContext'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'
import { GrantType } from '../data'

const tabs = [GrantType.EMAIL, GrantType.SMS]

const SwitchTabs = () => {
  const { t } = useT('login')
  const isLogin = usePathname().indexOf('login') > 1
  const { grantType, setGrantType, seconds, stateReset } = isLogin ? useLoginContext() : useForgetContext()

  return tabs.map((item) => {
    return (
      <span
        className={cn(
          'cursor-pointer select-none capitalize',
          grantType == item ? 'font-medium text-[#1aca75]' : 'text-[#666]',
          item == GrantType.SMS && 'ml-4'
        )}
        key={item}
        onClick={() => {
          if (!isLogin) return
          if (grantType != item && seconds == 60) {
            setGrantType(item)
            stateReset()
          }
        }}
      >
        {t('login:tabs', { name: t(item) })}
      </span>
    )
  })
}

export default SwitchTabs
