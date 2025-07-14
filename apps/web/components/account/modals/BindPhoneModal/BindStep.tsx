'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { Loader2Icon, XIcon } from 'lucide-react'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { PhoneNumberInput } from '@/components/common'
import { useT } from '@/i18n'
import { ONE_MINUTE_COUNT_DOWN, VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { useBindPhone, UserInfo, useSendBindCode } from '@/services/user'
import { HttpError } from '@/types/http'

interface Props {
  userInfo?: UserInfo
  onCancel?: () => void
  onSuccess?: () => void
}

const BindStep: FunctionComponent<Props> = ({ userInfo, onCancel, onSuccess }) => {
  const { t } = useT(['account', 'common'])
  const [targetDate, setTargetDate] = useState<number>()
  const { mutateAsync: mutateSendCode } = useSendBindCode()
  const { mutateAsync: mutateBindVerificationCode, isPending } = useBindPhone()

  const FormSchema = useMemo(
    () =>
      z.object({
        nationalCode: z.string(),
        phoneNumber: z.string(),
        verificationCode: z.string().regex(VERIFICATION_CODE_REGEX, t('account:verificationCodeError')).length(6),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nationalCode: '86',
      verificationCode: '',
    },
  })
  const { handleSubmit, formState, watch, reset, setValue } = form
  const nationalCode = watch('nationalCode')
  const phoneNumber = watch('phoneNumber')

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined)
    },
  })

  useEffect(() => {
    return () => {
      reset()
    }
  }, [])

  const handleSendCode = useCallback(() => {
    if (countdown) {
      return
    }

    mutateSendCode({ countryCode: nationalCode, phone: phoneNumber })
    setTargetDate(Date.now() + ONE_MINUTE_COUNT_DOWN)
  }, [mutateSendCode, nationalCode, phoneNumber])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        await mutateBindVerificationCode(data)
        onSuccess?.()
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateBindVerificationCode, onSuccess, userInfo]
  )

  return (
    <Form {...form}>
      <div className="mt-2 grid gap-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account:newPhoneNumber')}</FormLabel>
              <FormControl>
                <PhoneNumberInput
                  {...field}
                  onCountryChange={(nationalCode) => setValue('nationalCode', nationalCode)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account:phoneVerificationCode')}</FormLabel>
              <div
                aria-invalid={formState.errors.phoneNumber ? true : false}
                className="focus-within:border-ring focus-within:ring-primary aria-invalid:ring-destructive flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]"
              >
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder={t('account:phoneVerificationCode')}
                    className="focus-visible:ring-0"
                  />
                </FormControl>
                <span className={cn('text-link', !countdown && 'cursor-pointer')} onClick={handleSendCode}>
                  {countdown ? `${Math.round(countdown / 1000)}s` : t('common:send')}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <DialogFooter>
        <Button rounded="full" variant="secondary" onClick={onCancel}>
          {t('common:cancel')}
        </Button>
        <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
          {isPending && <Loader2Icon className="animate-spin" />}
          {t('common:confirm')}
        </Button>
      </DialogFooter>
    </Form>
  )
}

export default BindStep
