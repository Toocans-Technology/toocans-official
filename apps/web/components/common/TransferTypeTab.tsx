'use client'

import { FunctionComponent, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { InternalTransferType } from '@/types/withdraw'

interface Props {
  value: InternalTransferType
  className?: string
  onTransferTabChange?: (type: InternalTransferType) => void
}

const TransferTypeTab: FunctionComponent<Props> = ({ value, className, onTransferTabChange }) => {
  const { t } = useT('withdrawal')
  const transferTypeList = useMemo(() => {
    return [
      {
        label: t('withdrawal:email'),
        value: InternalTransferType.Email,
      },
      {
        label: t('withdrawal:phone'),
        value: InternalTransferType.Phone,
      },
      {
        label: t('withdrawal:uid'),
        value: InternalTransferType.UID,
      },
    ]
  }, [t])

  return (
    <div className={cn('flex gap-4', className)}>
      {transferTypeList.map((item) => (
        <div
          key={item.value}
          className={cn(
            'inline-flex cursor-pointer items-center rounded-md border border-solid border-[#f8f8f8] bg-[#f8f8f8] px-4 py-[5px]',
            value === item.value && 'border-brand'
          )}
          onClick={() => onTransferTabChange?.(item.value)}
        >
          <span className="text-foreground text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default TransferTypeTab
