'use client'

import { XIcon } from 'lucide-react'
import { FunctionComponent } from 'react'
import { Input, Separator } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Country } from '@/services/login'
import CountrySelect from './CountrySelect'

interface Props {
  invalid?: boolean
  value?: string
  name?: string
  endContent?: React.ReactNode
  onChange?: (value: string) => void
  onCountryChange?: (country: Country) => void
}

const PhoneNumberInput: FunctionComponent<Props> = ({
  invalid,
  value,
  onChange,
  onCountryChange,
  endContent,
  ...props
}) => {
  const { t } = useT(['common'])

  return (
    <div
      aria-invalid={invalid}
      className="hover:border-ring hover:ring-brand aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-2 overflow-hidden rounded-md bg-[#f8f8f8] px-2.5 hover:ring-[1px]"
    >
      <CountrySelect onChange={onCountryChange} />
      <Separator orientation="vertical" className="bg-[#999] data-[orientation=vertical]:h-2.5" />
      <Input
        id="phone"
        autoComplete="off"
        maxLength={100}
        placeholder={t('common:enterPhone')}
        className="aria-invalid:ring-0 px-0 hover:ring-0 focus-visible:ring-0"
        {...props}
        value={value}
        onChange={(e) => {
          const value = e.target.value.replace(/[^\d]/g, '')
          onChange?.(value)
        }}
      />
      {value && (
        <span
          className="inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-[#666]"
          onClick={() => {
            onChange?.('')
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
