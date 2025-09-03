'use client'

import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Label, toast } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { PhoneNumberInput, Input } from '@/components/common'
import { useT } from '@/i18n'
import { EMAIL_REGEX, INPUT_DEFAULT_VALUE } from '@/lib/utils'
import { Country } from '@/services/login'
import { User, useSearchUser } from '@/services/wallet/searchUser'
import { InputValueType } from '@/types/form'
import { InternalTransferType } from '@/types/withdraw'

interface Props {
  onChange?: (data?: User) => void
  onTransferTabChange?: (type: InternalTransferType) => void
}

const InternalTransfer: FunctionComponent<Props> = ({ onChange, onTransferTabChange }) => {
  const { t } = useT('withdrawal')
  const [email, setEmail] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [phone, setPhone] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [uid, setUid] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [countryCode, setCountryCode] = useState<CountryCode>()
  const [transferType, setTransferType] = useState(InternalTransferType.Email)

  const searchKey = useMemo(() => {
    if (transferType === InternalTransferType.UID) {
      return uid.value
    } else if (transferType === InternalTransferType.Phone) {
      const phoneNumber = `+${countryCode}${phone.value}`
      return isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined
    } else {
      return EMAIL_REGEX.test(email.value) ? email.value : undefined
    }
  }, [transferType, uid.value, phone.value, email.value, countryCode])

  const { refetch } = useSearchUser({
    searchKey,
    type: transferType,
  })

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

  const handleTabChange = useCallback(
    (value: InternalTransferType) => {
      setTransferType(value)
      if (value === InternalTransferType.Phone) {
        setPhone(INPUT_DEFAULT_VALUE)
      } else if (value === InternalTransferType.UID) {
        setUid(INPUT_DEFAULT_VALUE)
      } else {
        setEmail(INPUT_DEFAULT_VALUE)
      }

      onChange?.(undefined)
      onTransferTabChange?.(value)
    },
    [onChange, onTransferTabChange]
  )

  const handleRefetch = useCallback(async () => {
    const { data, error } = await refetch()

    if (data) {
      onChange?.(data)
    } else {
      onChange?.(undefined)

      if (error?.message) {
        toast.error(error?.message)
      }
    }
  }, [refetch, onChange])

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail((s) => ({ ...s, value, error: '', isInvalid: false }))
    },
    [setEmail]
  )

  const handleEmailBlur = useCallback(async () => {
    const isEmail = EMAIL_REGEX.test(email.value)

    if (isEmail) {
      setEmail((s) => ({ ...s, error: '', isInvalid: false }))
      handleRefetch()
    } else {
      setEmail((s) => ({ ...s, error: t('withdrawal:emailError'), isInvalid: true }))
    }
  }, [email.value, t, handleRefetch])

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhone((s) => ({ ...s, value, error: '', isInvalid: false }))
    },
    [setPhone]
  )

  const handlePhoneBlur = useCallback(() => {
    const isPhone = isValidPhoneNumber(`+${countryCode}${phone.value}`)

    if (isPhone) {
      setPhone((s) => ({ ...s, error: '', isInvalid: false }))
      handleRefetch()
    } else {
      setPhone((s) => ({ ...s, error: t('withdrawal:phoneError'), isInvalid: true }))
    }
  }, [phone.value, countryCode, t, handleRefetch])

  const handleUidChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, '')

      setUid((s) => ({ ...s, value, error: '', isInvalid: false }))
    },
    [setUid]
  )

  const handleUidBlur = useCallback(async () => {
    if (uid.value === '') {
      setUid((s) => ({ ...s, error: t('withdrawal:uidError'), isInvalid: true }))
    } else {
      setUid((s) => ({ ...s, error: '', isInvalid: false }))
      handleRefetch()
    }
  }, [handleRefetch, t, uid.value])

  return (
    <>
      <div className="flex gap-4">
        {transferTypeList.map((item) => (
          <div
            key={item.value}
            className={cn(
              'inline-flex cursor-pointer items-center rounded-md border border-solid border-[#f8f8f8] bg-[#f8f8f8] px-4 py-[5px]',
              transferType === item.value && 'border-brand'
            )}
            onClick={() => handleTabChange(item.value)}
          >
            <span className="text-foreground text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="max-w-[456px]">
        {transferType === InternalTransferType.Email && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="email">
              {t('withdrawal:accountName')}
            </Label>
            <Input
              name="email"
              aria-labelledby="email"
              value={email.value}
              invalid={email.isInvalid}
              maxLength={100}
              placeholder={t('withdrawal:emailPlaceholder')}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm">
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {email.isInvalid && <p className="text-destructive text-xs">{email.error}</p>}
          </div>
        )}
        {transferType === InternalTransferType.Phone && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="phone">
              {t('withdrawal:accountName')}
            </Label>
            <PhoneNumberInput
              name="phone"
              aria-labelledby="phone"
              value={phone.value}
              invalid={phone.isInvalid}
              onChange={handlePhoneChange}
              onCountryChange={(country: Country) => setCountryCode(country.nationalCode as CountryCode)}
              onBlur={handlePhoneBlur}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm">
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {phone.isInvalid && <p className="text-destructive text-xs">{phone.error}</p>}
          </div>
        )}
        {transferType === InternalTransferType.UID && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="uid">
              {t('withdrawal:accountName')}
            </Label>
            <Input
              name="uid"
              aria-labelledby="uid"
              value={uid.value}
              invalid={uid.isInvalid}
              maxLength={100}
              placeholder={t('withdrawal:uidPlaceholder')}
              onChange={handleUidChange}
              onBlur={handleUidBlur}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm">
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {uid.isInvalid && <p className="text-destructive text-xs">{uid.error}</p>}
          </div>
        )}
      </div>
    </>
  )
}

export default InternalTransfer
