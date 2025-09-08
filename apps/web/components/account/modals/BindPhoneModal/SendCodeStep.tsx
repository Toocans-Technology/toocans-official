'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
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
import { useT } from '@/i18n'
import { ONE_MINUTE_COUNT_DOWN, VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { useBindVerificationCode, UserInfo, useSendCodeByUserPhoneOrEmail } from '@/services/user'
import { HttpError } from '@/types/http'

interface Props {
  userInfo?: UserInfo
  onSuccess?: () => void
}

const SendCodeStep: FunctionComponent<Props> = ({ userInfo, onSuccess }) => {
  const { t } = useT(['account', 'common'])
  const [targetDate, setTargetDate] = useState<number>()
  const { mutateAsync: mutateSendCode } = useSendCodeByUserPhoneOrEmail()
  const { mutateAsync: mutateBindVerificationCode, isPending } = useBindVerificationCode()
  const hasGaKey = userInfo?.hasGaKey ?? false

  const FormSchema = useMemo(
    () =>
      z.object({
        code: z.string().regex(VERIFICATION_CODE_REGEX, t('account:verificationCodeError')).length(6),
        googleCode: hasGaKey
          ? z.string().regex(VERIFICATION_CODE_REGEX, t('account:verificationCodeError')).length(6)
          : z.string().optional(),
      }),
    [hasGaKey, t]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
      googleCode: '',
    },
  })
  const { handleSubmit, formState, reset } = form

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

  const handleSendCode = useCallback(
    async (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()

      if (countdown) {
        return
      }

      try {
        await mutateSendCode({})
        setTargetDate(Date.now() + ONE_MINUTE_COUNT_DOWN)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateSendCode, countdown]
  )

  const onSubmitCode = useCallback(
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account:emailVerificationCode')}</FormLabel>
              <div
                aria-invalid={formState.errors.code ? true : false}
                className="focus-within:border-ring focus-within:ring-brand aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-4 overflow-hidden rounded-md bg-[#f8f8f8] pr-4 focus-within:ring-[1px]"
              >
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    maxLength={6}
                    placeholder={t('account:emailVerificationCode')}
                    className="aria-invalid:ring-0 focus-visible:ring-0"
                  />
                </FormControl>
                <span className={cn('text-link text-nowrap', !countdown && 'cursor-pointer')} onClick={handleSendCode}>
                  {countdown ? `${Math.round(countdown / 1000)}s` : t('common:send')}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {hasGaKey && (
          <FormField
            control={form.control}
            name="googleCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('account:google2FA')}</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" maxLength={6} placeholder={t('account:google2FAPlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <DialogFooter>
        <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmitCode)}>
          {isPending && <Loader2Icon className="animate-spin" />}
          {t('common:next')}
        </Button>
      </DialogFooter>
    </Form>
  )
}

export default SendCodeStep
