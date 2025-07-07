'use client'

import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const SwitchTabs = () => {
  const { t } = useT('login')
  const { verifiType, setVerifiType, seconds, stateReset } = useLoginContext()

  const tabs = ['email', 'phone']

  return tabs.map((item) => {
    return (
      <span
        className={cn(
          'select-none',
          'cursor-pointer',
          verifiType == item ? 'font-medium text-[#222]' : 'text-[#666]',
          item == 'phone' && 'ml-4'
        )}
        key={item}
        onClick={() => {
          if (verifiType != item && seconds == 60) {
            setVerifiType(item)
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
