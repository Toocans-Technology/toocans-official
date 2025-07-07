'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useCallback, useRef, useState, useEffect } from 'react'
import {
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getCountrys } from '@/services/login'
import { useLoginContext } from '../../LoginContext'
import { matchPhoneNum } from '../../utils'

const PhoneInput = () => {
  const { t } = useT('login')
  const { seconds, formData, cuntrysVisible, setCuntrysVisible, phoneCheckState, setPhoneCheckState } =
    useLoginContext()

  const {
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = formData

  const { data: countrys } = useQuery(getCountrys()) as any
  const phoneInputRef: any = useRef(null)

  // console.log(countrys)

  const phoneValue = watch('phone')
  const codeValue = watch('code')
  const nationalCodeValue = watch('nationalCode')

  const openChenckPhone = useCallback(() => {
    return !!errors.phone?.message && !cuntrysVisible
  }, [errors.phone, cuntrysVisible])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!phoneInputRef?.current?.contains(event.target) && phoneCheckState && !matchPhoneNum(codeValue, phoneValue)) {
        setError('phone', { type: 'custom', message: t('formatErr.phone') })
      }
    }

    phoneCheckState && document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [phoneCheckState, phoneValue])
  return (
    <>
      <div ref={phoneInputRef} className="relative">
        <Input
          {...register('phone')}
          aria-invalid={openChenckPhone()}
          disabled={seconds < 60}
          type="text"
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, '')
            setValue('phone', value, { shouldValidate: true })
          }}
          onFocus={() => {
            setError('phone', { type: 'custom', message: '' })
            setPhoneCheckState(true)
          }}
          maxLength={11}
          placeholder={t(`login:enter.phone`)}
          className="mt-2 bg-[#f8f8f8] pl-16"
        />

        <Popover>
          <PopoverTrigger
            onClick={() => setCuntrysVisible(!cuntrysVisible)}
            asChild
            className="absolute left-3 top-1/2 flex h-5 -translate-y-1/2 cursor-pointer items-end gap-[2px] border-r-2 pr-1 text-xs text-[#666] hover:bg-transparent"
          >
            <div>
              +{countrys?.[0]?.nationalCode}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={cn(cuntrysVisible && 'rotate-180', 'pointer-events-none')}
                fill="none"
              >
                <path
                  opacity="0.6"
                  d="M9.33857 10.3092C8.94583 10.9282 8.04252 10.9282 7.64978 10.3092L5.66188 7.17585C5.23948 6.51007 5.71781 5.64014 6.50628 5.64014L10.4821 5.64014C11.2705 5.64014 11.7489 6.51007 11.3265 7.17585L9.33857 10.3092Z"
                  fill="#666666"
                />
              </svg>
            </div>
          </PopoverTrigger>

          <PopoverContent
            onCloseAutoFocus={() => setCuntrysVisible(!cuntrysVisible)}
            className="w-96 p-2"
            side="bottom"
            align="start"
            alignOffset={-15}
            sideOffset={20}
          >
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>Profile</CommandItem>
                  <CommandItem>Billing</CommandItem>
                  <CommandItem>Settings</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {phoneValue && seconds == 60 && (
          <Button
            className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
            type="button"
            variant="ghost"
            onClick={() => setValue('phone', '')}
          >
            <CircleX />
          </Button>
        )}
      </div>
      {openChenckPhone() && <p className="text-destructive mt-2 text-[12px]">{t('formatErr.phone')}</p>}
    </>
  )
}

export default PhoneInput
