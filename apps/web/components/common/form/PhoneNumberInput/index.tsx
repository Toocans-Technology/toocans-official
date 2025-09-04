'use client'

import { XIcon } from 'lucide-react'
import { FunctionComponent } from 'react'
import { Input, Separator } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { Country } from '@/services/login'
import CountrySelect from './CountrySelect'

interface Props {
  tag?: string
  invalid?: boolean
  value?: string
  name?: string
  className?: string
  nationalCode?: string
  endContent?: React.ReactNode
  onBlur?: () => void
  onChange?: (value: string) => void
  onClear?: () => void
  onCountryChange?: (country: Country) => void
}

const PhoneNumberInput: FunctionComponent<Props> = ({
  tag,
  invalid,
  value,
  className,
  nationalCode,
  onChange,
  onCountryChange,
  endContent,
  onBlur,
  onClear,
  ...props
}) => {
  const { t } = useT(['common'])

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        'hover:border-ring hover:ring-brand aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] focus-within:border-ring focus-within:ring-brand flex items-center gap-2 overflow-hidden rounded-md bg-[#f8f8f8] px-2.5 focus-within:ring-[1px] hover:ring-[1px]',
        tag && 'py-2.5',
        className
      )}
    >
      <div className="flex flex-1 flex-col items-start">
        {tag && (
          <span className="text-brand border-brand inline-flex rounded border border-solid px-2 text-[10px]">
            {tag}
          </span>
        )}
        <div className="flex w-full items-center gap-2">
          <CountrySelect nationalCode={nationalCode} onChange={onCountryChange} />
          <Separator orientation="vertical" className="bg-[#999] data-[orientation=vertical]:h-2.5" />
          <Input
            id="phone"
            autoComplete="off"
            maxLength={100}
            placeholder={t('common:enterPhone')}
            className={cn('aria-invalid:ring-0 flex-1 px-0 hover:ring-0 focus-visible:ring-0', tag && 'h-7.5')}
            {...props}
            value={value}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '')
              onChange?.(value)
            }}
            onBlur={onBlur}
          />
        </div>
      </div>
      {value && (
        <span
          className="inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-[#666]"
          onClick={() => {
            onChange?.('')
            onClear?.()
          }}
        >
          <XIcon color="#fff" size={12} />
        </span>
      )}
      {endContent}
    </div>
  )
}

export default PhoneNumberInput
