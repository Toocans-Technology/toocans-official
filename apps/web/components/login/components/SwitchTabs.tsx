'use client'

import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const SwitchTabs = () => {
  const { t } = useT('login')
  const { grantType, setGrantType, seconds, stateReset } = useLoginContext()

  const tabs = ['email', 'sms']

  return tabs.map((item) => {
    return (
      <span
        className={cn(
          'select-none',
          'cursor-pointer',
          grantType == item ? 'font-medium text-[#222]' : 'text-[#666]',
          item == 'sms' && 'ml-4'
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
