'use client'

import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Button, Input, Label } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { PhoneNumberInput } from '@/components/common'
import { useT } from '@/i18n'
import { Country } from '@/services/login'
import { InputValueType } from '@/types/form'

enum TransferType {
  Email,
  Phone,
  UID,
}

interface Props {}

const InternalTransfer: FunctionComponent<Props> = () => {
  const { t } = useT('withdrawal')
  const [email, setEmail] = useState<InputValueType>({ value: '', error: '', isInvalid: false })
  const [phone, setPhone] = useState<InputValueType>({ value: '', error: '', isInvalid: false })
  const [uid, setUid] = useState<InputValueType>({ value: '', error: '', isInvalid: false })
  const [countryCode, setCountryCode] = useState('')
  const [transferType, setTransferType] = useState(TransferType.Email)

  const transferTypeList = useMemo(() => {
    return [
      {
        label: t('withdrawal:email'),
        value: TransferType.Email,
      },
      {
        label: t('withdrawal:phone'),
        value: TransferType.Phone,
      },
      {
        label: t('withdrawal:uid'),
        value: TransferType.UID,
      },
    ]
  }, [t])

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail((s) => ({ ...s, value: e.target.value }))
  }, [])

  const handlePhoneChange = useCallback((value: string) => {
    setPhone((s) => ({ ...s, value }))
  }, [])

  const handleUidChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUid((s) => ({ ...s, value: e.target.value }))
  }, [])

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
            onClick={() => setTransferType(item.value)}
          >
            <span className="text-foreground text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="max-w-[518px]">
        {transferType === TransferType.Email && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="email">
              {t('withdrawal:accountName')}
            </Label>
            <Input
              name="email"
              aria-labelledby="email"
              value={email.value}
              placeholder={t('withdrawal:emailPlaceholder')}
              onChange={handleEmailChange}
            />
            {email.isInvalid && <p className="text-destructive text-xs">{email.error}</p>}
          </div>
        )}
        {transferType === TransferType.Phone && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="phone">
              {t('withdrawal:accountName')}
            </Label>
            <PhoneNumberInput
              data-id="phone"
              name="phone"
              aria-labelledby="phone"
              invalid={phone.isInvalid}
              onChange={handlePhoneChange}
              onCountryChange={(country: Country) => setCountryCode(country.nationalCode)}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm">
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
          </div>
        )}
        {transferType === TransferType.UID && (
          <div className="mt-2 flex flex-col gap-2">
            <Label className="text-sm" htmlFor="uid">
              {t('withdrawal:accountName')}
            </Label>
            <div className="focus-within:border-ring focus-within:ring-brand flex items-center gap-4 overflow-hidden rounded-md bg-[#f8f8f8] pr-3 focus-within:ring-[1px]">
              <Input
                value={uid.value}
                placeholder={t('withdrawal:uidPlaceholder')}
                className="flex-1 hover:ring-0 focus-visible:ring-0"
                onChange={handleUidChange}
              />
              <Button variant="ghost" size="icon" className="size-6" rounded="sm">
                <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InternalTransfer
