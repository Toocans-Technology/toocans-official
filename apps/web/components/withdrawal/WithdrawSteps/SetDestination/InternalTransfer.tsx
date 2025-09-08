'use client'

import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Label, toast } from '@workspace/ui/components'
import { PhoneNumberInput, Link, TransferTypeTab, InputWithTag } from '@/components/common'
import { useT } from '@/i18n'
import { EMAIL_REGEX, INPUT_DEFAULT_VALUE, PATHNAMES } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { Country } from '@/services/login'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { User, useSearchUser } from '@/services/wallet/searchUser'
import { InputValueType } from '@/types/form'
import { AddressType, InternalTransferType } from '@/types/withdraw'
import { SelectAddressModal } from '../../modals'

interface AccountNameLabelProps {
  htmlFor: string
}

const AccountNameLabel: FunctionComponent<AccountNameLabelProps> = ({ htmlFor }) => {
  const { t } = useT('withdrawal')

  return (
    <div className="flex justify-between">
      <Label className="text-sm text-[#222]" htmlFor={htmlFor}>
        {t('withdrawal:accountName')}
      </Label>
      <Link href={PATHNAMES.withdrawAddress} target="_blank" className="text-link hover:text-link/80 text-sm">
        {t('withdrawal:manageAddresses')}
      </Link>
    </div>
  )
}

interface Props {
  token: Token
  onChange?: (data?: User) => void
  onSelectAddress?: (address?: WithdrawAddress) => void
  onTransferTabChange?: (type: InternalTransferType) => void
}

const InternalTransfer: FunctionComponent<Props> = ({ token, onChange, onSelectAddress, onTransferTabChange }) => {
  const { t } = useT('withdrawal')
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [phone, setPhone] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [uid, setUid] = useState<InputValueType>(INPUT_DEFAULT_VALUE)
  const [countryCode, setCountryCode] = useState<string>()
  const [transferType, setTransferType] = useState(InternalTransferType.Email)
  const [selectedAddress, setSelectedAddress] = useState<WithdrawAddress>()

  const searchKey = useMemo(() => {
    if (transferType === InternalTransferType.UID) {
      return uid.value
    } else if (transferType === InternalTransferType.Phone) {
      return isValidPhoneNumber(`+${countryCode}${phone.value}`) ? `${countryCode}${phone.value}` : undefined
    } else {
      return email.value && EMAIL_REGEX.test(email.value) ? email.value : undefined
    }
  }, [transferType, uid.value, phone.value, email.value, countryCode])

  const addressTypes = useMemo(() => [AddressType.UID, AddressType.Email, AddressType.Phone], [])

  const { refetch } = useSearchUser({
    searchKey,
    type: transferType,
  })

  const handleClearAddress = useCallback(() => {
    setSelectedAddress(undefined)
    onSelectAddress?.(undefined)
    onChange?.(undefined)
  }, [onSelectAddress, onChange])

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

      handleClearAddress()
      onTransferTabChange?.(value)
    },
    [onTransferTabChange, handleClearAddress]
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

  useEffect(() => {
    if (selectedAddress) {
      handleRefetch()
    }
  }, [selectedAddress, handleRefetch])

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail((s) => ({ ...s, value, error: '', isInvalid: false }))
      handleClearAddress()
    },
    [handleClearAddress]
  )

  const handleEmailBlur = useCallback(async () => {
    const isEmail = email.value && EMAIL_REGEX.test(email.value)

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
      handleClearAddress()
    },
    [handleClearAddress]
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
      handleClearAddress()
    },
    [handleClearAddress]
  )

  const handleUidBlur = useCallback(async () => {
    if (uid.value === '') {
      setUid((s) => ({ ...s, error: t('withdrawal:uidError'), isInvalid: true }))
    } else {
      setUid((s) => ({ ...s, error: '', isInvalid: false }))
      handleRefetch()
    }
  }, [handleRefetch, t, uid.value])

  const handleConfirm = useCallback(
    (address?: WithdrawAddress) => {
      if (address) {
        let type = InternalTransferType.Email

        if (address.addressType === AddressType.Email) {
          type = InternalTransferType.Email
          setEmail((s) => ({ ...s, value: address.address, isInvalid: false }))
        } else if (address.addressType === AddressType.Phone) {
          type = InternalTransferType.Phone
          const phoneNumber = parsePhoneNumber(`+${address.address ?? ''}`)
          setCountryCode(phoneNumber?.countryCallingCode ?? '1')
          setPhone((s) => ({ ...s, value: phoneNumber?.nationalNumber ?? '', isInvalid: false }))
        } else {
          type = InternalTransferType.UID
          setUid((s) => ({ ...s, value: address.address, isInvalid: false }))
        }

        setTransferType(type)
      }

      setSelectedAddress(address)
      onSelectAddress?.(address)
    },
    [onSelectAddress]
  )

  return (
    <>
      <TransferTypeTab value={transferType} onTransferTabChange={handleTabChange} />
      <div className="max-w-[456px]">
        {transferType === InternalTransferType.Email && (
          <div className="mt-2 flex flex-col gap-2">
            <AccountNameLabel htmlFor="email" />
            <InputWithTag
              name="email"
              value={email.value}
              invalid={email.isInvalid}
              maxLength={100}
              tag={selectedAddress?.addressName}
              placeholder={t('withdrawal:emailPlaceholder')}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onClear={handleClearAddress}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm" onClick={() => setOpen(true)}>
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {email.isInvalid && <p className="text-destructive text-xs">{email.error}</p>}
          </div>
        )}
        {transferType === InternalTransferType.Phone && (
          <div className="mt-2 flex flex-col gap-2">
            <AccountNameLabel htmlFor="phone" />
            <PhoneNumberInput
              name="phone"
              value={phone.value}
              invalid={phone.isInvalid}
              onChange={handlePhoneChange}
              tag={selectedAddress?.addressName}
              onCountryChange={(country: Country) => setCountryCode(country.nationalCode)}
              nationalCode={countryCode}
              onBlur={handlePhoneBlur}
              onClear={handleClearAddress}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm" onClick={() => setOpen(true)}>
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {phone.isInvalid && <p className="text-destructive text-xs">{phone.error}</p>}
          </div>
        )}
        {transferType === InternalTransferType.UID && (
          <div className="mt-2 flex flex-col gap-2">
            <AccountNameLabel htmlFor="uid" />
            <InputWithTag
              name="uid"
              value={uid.value}
              invalid={uid.isInvalid}
              maxLength={100}
              tag={selectedAddress?.addressName}
              placeholder={t('withdrawal:uidPlaceholder')}
              onChange={handleUidChange}
              onBlur={handleUidBlur}
              onClear={handleClearAddress}
              endContent={
                <Button variant="ghost" size="icon" className="size-6" rounded="sm" onClick={() => setOpen(true)}>
                  <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
                </Button>
              }
            />
            {uid.isInvalid && <p className="text-destructive text-xs">{uid.error}</p>}
          </div>
        )}
      </div>
      <SelectAddressModal
        open={open}
        value={selectedAddress?.id}
        token={token}
        addressTypes={addressTypes}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default InternalTransfer
