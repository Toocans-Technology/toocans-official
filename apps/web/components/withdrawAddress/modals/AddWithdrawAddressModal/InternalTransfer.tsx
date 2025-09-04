'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js'
import { Loader2Icon } from 'lucide-react'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  Button,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
} from '@workspace/ui/components'
import { Input, PhoneNumberInput, TransferTypeTab } from '@/components/common'
import { useT } from '@/i18n'
import { EMAIL_REGEX, NUMBER_REGEX } from '@/lib/utils'
import { useAddWithdrawAddress } from '@/services/wallet'
import { HttpError } from '@/types/http'
import { AddressType, addressTypeSchema, InternalTransferType } from '@/types/withdraw'

interface Props {
  onSuccess?: (addressType: AddressType) => void
}

const InternalTransfer: FunctionComponent<Props> = ({ onSuccess }) => {
  const { t } = useT(['withdrawal', 'withdrawAddress'])
  const [nationalCode, setNationalCode] = useState<CountryCode>()
  const [transferType, setTransferType] = useState(InternalTransferType.Email)
  const { mutateAsync: addWithdrawAddress, isPending } = useAddWithdrawAddress()

  const addressType = useMemo(() => {
    if (transferType === InternalTransferType.Email) {
      return AddressType.Email
    } else if (transferType === InternalTransferType.Phone) {
      return AddressType.Phone
    } else {
      return AddressType.UID
    }
  }, [transferType])

  const FormSchema = useMemo(() => {
    let message = t('withdrawAddress:accountError')

    if (transferType === InternalTransferType.Phone) {
      message = t('withdrawAddress:phoneError')
    }

    return z.object({
      nationalCode: z.string().optional(),
      addressType: addressTypeSchema,
      addressName: z.optional(z.string()),
      address: z.string().refine(
        (value) => {
          if (transferType === InternalTransferType.Email) {
            return EMAIL_REGEX.test(value)
          } else if (transferType === InternalTransferType.Phone) {
            return isValidPhoneNumber(`+${nationalCode}${value}`)
          } else {
            return value.length > 0 && NUMBER_REGEX.test(value)
          }
        },
        {
          message,
        }
      ),
    })
  }, [t, transferType, nationalCode])

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      addressName: '',
      address: '',
      addressType,
    },
  })

  const { handleSubmit, formState, resetField } = form

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await addWithdrawAddress({
          ...data,
          tokenId: '',
          addressType,
          address: `${nationalCode}${data.address}`,
        })
        toast.success(t('withdrawAddress:addSuccess'))
        onSuccess?.(addressType)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [addWithdrawAddress, addressType, nationalCode, onSuccess, t]
  )

  const handleTransferTabChange = useCallback(
    (value: InternalTransferType) => {
      setTransferType(value)
      resetField('address')
    },
    [resetField]
  )

  return (
    <>
      <TransferTypeTab value={transferType} onTransferTabChange={handleTransferTabChange} />
      <Form {...form}>
        <div className="mt-4 grid gap-6">
          {transferType === InternalTransferType.Email && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('withdrawAddress:account')}</FormLabel>
                  <FormControl>
                    <Input {...field} autoCapitalize="off" placeholder={t('withdrawal:emailPlaceholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {transferType === InternalTransferType.Phone && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('withdrawAddress:account')}</FormLabel>
                  <FormControl>
                    <PhoneNumberInput
                      {...field}
                      onChange={(value) => field.onChange(value)}
                      onCountryChange={(country) => setNationalCode(country.nationalCode as CountryCode)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {transferType === InternalTransferType.UID && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('withdrawAddress:account')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('withdrawal:uidPlaceholder')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value
                        if (NUMBER_REGEX.test(value)) {
                          field.onChange(value)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="addressName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('withdrawAddress:name')}({t('withdrawAddress:optional')})
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={20}
                    autoCapitalize="off"
                    placeholder={t('withdrawAddress:remarkPlaceholder')}
                    endContent={
                      <span className="text-sm">
                        {field.value?.length || 0}/{20}
                      </span>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
            {isPending && <Loader2Icon className="animate-spin" />}
            {t('common:save')}
          </Button>
        </DialogFooter>
      </Form>
    </>
  )
}

export default InternalTransfer
