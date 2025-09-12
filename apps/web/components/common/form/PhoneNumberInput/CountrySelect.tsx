'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Button } from '@workspace/ui/components'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useLang } from '@/hooks'
import { useT } from '@/i18n'
import { Locale } from '@/i18n/config'
import { Country, getCountryList } from '@/services/login'

interface Props {
  value?: string
  onChange?: (country: Country) => void
}

const CountrySelect: FunctionComponent<Props> = ({ onChange, value }) => {
  const { t } = useT(['common'])
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [nationalCode, setNationalCode] = useState('1')
  const { data: countryList } = getCountryList()

  const getCountryByNationalCode = useCallback(
    (value: string) => {
      if (countryList?.length) {
        return countryList.find((country) => country.nationalCode === value)
      }
      return null
    },
    [countryList]
  )

  useEffect(() => {
    if (countryList?.length) {
      const country = getCountryByNationalCode(nationalCode)

      if (!country) {
        return
      }

      setNationalCode(country.nationalCode)
      onChange?.(country)
    }
  }, [countryList, getCountryByNationalCode, onChange, nationalCode])

  useEffect(() => {
    if (value) {
      const country = getCountryByNationalCode(value)

      if (!country) {
        return
      }

      setNationalCode(country.nationalCode)
      onChange?.(country)
    }
  }, [value, getCountryByNationalCode, onChange])

  const handleSelect = useCallback(
    (value: string) => {
      const selectedCountry = countryList?.find((country) => country.nationalCode === value)

      if (!selectedCountry) {
        return
      }

      setNationalCode(value)
      setOpen(false)
      onChange?.(selectedCountry)
    },
    [countryList, setOpen, setNationalCode, onChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-5 w-auto justify-between border-none bg-transparent hover:bg-transparent has-[>svg]:px-0"
        >
          +{nationalCode}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[384px] border-none p-0 shadow-lg" align="start" alignOffset={-12} sideOffset={24}>
        <Command className="p-3">
          <CommandInput placeholder={t('common:search')} />
          <CommandList className="pt-2">
            <CommandEmpty>{t('common:noNationalCode')}</CommandEmpty>
            {countryList?.map((country) => (
              <CommandItem
                key={country.id}
                value={country.nationalCode}
                onSelect={handleSelect}
                keywords={[`+${country.nationalCode}`, country.countryName, country.countryEnName ?? '']}
                className={cn('py-3', value === country.nationalCode && 'data-[selected=true]:bg-[#f4f4f4]')}
              >
                <Image
                  src={country.flagUrls[0]?.url ?? ''}
                  width={20}
                  height={20}
                  alt={lang === Locale.ZH_CN ? country.countryName : (country.countryEnName ?? '')}
                />
                <div className="flex-1 text-sm text-[#0D0D0D]">
                  {lang === Locale.ZH_CN ? country.countryName : country.countryEnName}
                </div>
                <span className="font-medium">+{country.nationalCode}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CountrySelect
