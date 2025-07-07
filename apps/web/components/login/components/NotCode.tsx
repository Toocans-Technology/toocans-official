'use client'

import { Tooltip, TooltipTrigger, TooltipContent } from '@workspace/ui/components'
import { useT } from '@/i18n'

const NotCode = () => {
  const { t } = useT('login')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-auto text-xs text-[#a9a9a9]">{t('notCode.tip1')}</span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="w-70 bg-white p-4"
        style={{ boxShadow: '0px 9px 28px 8px rgba(0, 0, 0, 0.10)' }}
      >
        <p className="text-base text-black">{t('notCode.tip2')}</p>
        <ul className="list-disc pl-4 text-sm text-[#666]">
          <li>{t('notCode.step1')}</li>
          <li>{t('notCode.step2')}</li>
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}

export default NotCode
