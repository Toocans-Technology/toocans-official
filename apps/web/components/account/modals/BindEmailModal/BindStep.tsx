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
import { useT } from '@/i18n'
import { EMAIL_REGEX, ONE_MINUTE_COUNT_DOWN, VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { useBindEmail, UserInfo, useSendBindCode } from '@/services/user'
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
  const { mutateAsync: mutateBindEmail, isPending } = useBindEmail()

  const FormSchema = useMemo(
    () =>
      z.object({
        email: z.string().regex(EMAIL_REGEX, t('account:newEmailError')),
        verificationCode: z.string().regex(VERIFICATION_CODE_REGEX, t('account:verificationCodeError')).length(6),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })
  const { handleSubmit, formState, watch, trigger, reset } = form
  const email = watch('email')

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

  const handleSendCode = useCallback(async () => {
    trigger('email')

    if (countdown || !!formState.errors.email) {
      return
    }

    try {
      await mutateSendCode({ email })
      setTargetDate(Date.now() + ONE_MINUTE_COUNT_DOWN)
    } catch (error) {
      toast.error((error as HttpError).message)
    }
  }, [mutateSendCode, countdown, email, formState.errors.email])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        await mutateBindEmail(data)
        onSuccess?.()
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateBindEmail, onSuccess, userInfo]
  )

  return (
    <Form {...form}>
      <div className="mt-2 grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account:newEmail')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t('account:newEmailPlaceholder')}
                  className="aria-invalid:ring-0 hover:ring-0 focus-visible:ring-0"
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
              <FormLabel>{t('account:emailVerificationCode')}</FormLabel>
              <div
                aria-invalid={formState.errors.verificationCode ? true : false}
                className="focus-within:border-ring focus-within:ring-brand aria-invalid:ring-destructive flex items-center gap-4 overflow-hidden rounded-md bg-[#f8f8f8] pr-4 focus-within:ring-[1px]"
              >
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    maxLength={6}
                    placeholder={t('account:emailVerificationCode')}
                    className="aria-invalid:ring-0 hover:ring-0 focus-visible:ring-0"
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
