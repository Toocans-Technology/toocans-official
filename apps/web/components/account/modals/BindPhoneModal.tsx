'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  toast,
} from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { ONE_MINUTE_COUNT_DOWN, VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { useBindVerificationCode, useSendCodeByUserPhoneOrEmail, useUserInfo } from '@/services/user'
import { useBindPhone } from '@/services/user'
import { HttpError } from '@/types/http'

enum BindStep {
  sendCode,
  bind,
}

const BindPhoneModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<BindStep>(BindStep.sendCode)
  const [targetDate, setTargetDate] = useState<number>()
  const { data: userInfo, refetch } = useUserInfo()
  const { mutateAsync: mutateSendCode } = useSendCodeByUserPhoneOrEmail()
  const { mutateAsync: mutateBindVerificationCode } = useBindVerificationCode()
  const { mutateAsync: mutateBindPhone, isPending } = useBindPhone()
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
  }, [open])

  const handleSendCode = useCallback(() => {
    if (countdown) {
      return
    }

    mutateSendCode({})
    setTargetDate(Date.now() + ONE_MINUTE_COUNT_DOWN)
  }, [mutateSendCode])

  const onSubmitCode = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        await mutateBindVerificationCode(data)
        setStep(BindStep.bind)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateBindVerificationCode, refetch, userInfo]
  )

  const onSubmitPhone = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        // const res = await mutateBindPhone(data)
        // if (!res) {
        //   return
        // }
        // toast.success(t('account:bindPhoneSuccess'))
        // refetch()
        // setOpen(false)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateBindPhone, refetch, userInfo]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" variant="secondary">
          {t('common:settings')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('account:bindPhoneNumber')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <div className="mt-2 grid gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:phoneVerificationCode')}</FormLabel>
                  <div
                    aria-invalid={formState.errors.code ? true : false}
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
            {hasGaKey && (
              <FormField
                control={form.control}
                name="googleCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('withdrawal:googleAuth')}</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" placeholder={t('withdrawal:googleAuthPlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <DialogFooter>
            {step === BindStep.sendCode ? (
              <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmitCode)}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {t('common:next')}
              </Button>
            ) : (
              <>
                <Button rounded="full" variant="secondary" onClick={() => setOpen(false)}>
                  {t('common:cancel')}
                </Button>
                <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmitPhone)}>
                  {isPending && <Loader2Icon className="animate-spin" />}
                  {t('common:confirm')}
                </Button>
              </>
            )}
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default BindPhoneModal
