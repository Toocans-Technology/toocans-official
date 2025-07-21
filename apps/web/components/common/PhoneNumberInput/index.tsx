'use client'

import { XIcon } from 'lucide-react'
import { FunctionComponent } from 'react'
import { Input, Separator } from '@workspace/ui/components'
import { useT } from '@/i18n'
import CountrySelect from './CountrySelect'

interface Props {
  invalid?: boolean
  value?: string
  onChange?: (value: string) => void
  onCountryChange?: (nationalCode: string) => void
}

const PhoneNumberInput: FunctionComponent<Props> = ({ invalid, value, onChange, onCountryChange, ...props }) => {
  const { t } = useT(['common'])

  return (
    <div
      aria-invalid={invalid}
      className="focus-within:border-ring focus-within:ring-primary aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-2 overflow-hidden rounded bg-[#f8f8f8] px-3 focus-within:ring-[1px]"
    >
      <CountrySelect onChange={onCountryChange} />
      <Separator orientation="vertical" className="max-h-2.5 bg-[#999]" />
      <Input
        autoComplete="off"
        placeholder={t('common:enterPhone')}
        className="aria-invalid:ring-0 px-0 focus-visible:ring-0"
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
    </div>
  )
}

export default PhoneNumberInput
