'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'
import { GrantType } from '../data'

const tabs = [GrantType.EMAIL, GrantType.SMS]

const SwitchTabs = () => {
  const { t } = useT('login')
  const { grantType, setGrantType, seconds, stateReset } = useLoginContext()

  return tabs.map((item) => {
    return (
      <span
        className={cn(
          'select-none',
          'cursor-pointer',
          grantType == item ? 'font-medium text-[#222]' : 'text-[#666]',
          item == GrantType.SMS && 'ml-4'
        )}
        key={item}
        onClick={() => {
          if (grantType != item && seconds == 60) {
            setGrantType(item)
            stateReset()
          }
        }}
      >
        {t(item)}
      </span>
    )
  })
}

export default SwitchTabs
