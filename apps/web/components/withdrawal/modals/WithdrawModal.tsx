'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
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
import { Token } from '@/services/basicConfig'
import { getVerifyCode, useWithdraw } from '@/services/wallet'
import { HttpError } from '@/types/http'
import { VerifyType } from '@/types/withdraw'

const COUNT_DOWN = 59 * 1000

interface Props {
  token: Token
  accountId: number
  address: string
  amount: number
  tokenFee: number
  disabled?: boolean
  openDetail?: (open: boolean) => void
}

const WithdrawModal: FunctionComponent<Props> = ({
  accountId,
  address,
  token,
  amount,
  tokenFee,
  openDetail,
  disabled = true,
}) => {
  const hasGaKey = false
  const { t } = useT(['withdrawal', 'common'])
  const [verifyType, setVerifyType] = useState<VerifyType>(VerifyType.email)
  const [targetDate, setTargetDate] = useState<number>()
  const { refetch } = getVerifyCode({ type: verifyType })
  const { mutateAsync: mutateWithdraw, isPending } = useWithdraw()

  const FormSchema = useMemo(
    () =>
      z.object({
        code: z.string().min(6).max(6),
        gaCode: hasGaKey ? z.string().min(6).max(6) : z.string().optional(),
      }),
    [hasGaKey]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
      gaCode: '',
    },
  })
  const { handleSubmit, formState } = form

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined)
    },
  })

  const handleSendCode = useCallback(() => {
    if (countdown) {
      return
    }

    refetch()
    setTargetDate(Date.now() + COUNT_DOWN)
  }, [refetch, countdown])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await mutateWithdraw({
          ...data,
          accountId,
          address,
          amount,
          tokenFee,
          tokenId: token.tokenId,
          chargeType: token.tokenSetting?.withdrawChargeType,
        })
        openDetail?.(true)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateWithdraw, accountId, address, amount, tokenFee, token]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button fullWidth rounded="full" disabled={disabled} className="mt-4 max-w-[456px]">
          {t('common:next')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:withdrawModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:network')}</div>
            <div className="text-right font-medium">{token?.chainName ?? token?.protocolName}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:address')}</div>
            <div className="overflow-hidden break-words text-right font-medium">{address}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:amount')}</div>
            <div className="text-right font-medium">
              {amount} {token?.tokenName}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</div>
            <div className="text-right font-medium">
              {tokenFee} {token?.tokenName}
            </div>
          </div>
        </div>
        <Form {...form}>
          <div className="mt-4 grid gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>
                    {verifyType === VerifyType.email
                      ? t('withdrawal:emailAuth', { email: 'xxxx@gmail.com' })
                      : t('withdrawal:phoneAuth', { phone: '1234567890' })}
                  </FormLabel>
                  <div
                    aria-invalid={formState.errors.code ? true : false}
                    className="focus-within:border-ring focus-within:ring-primary aria-invalid:ring-destructive flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]"
                  >
                    <FormControl>
                      <Input
                        {...field}
                        autoCapitalize="off"
                        placeholder={t('withdrawal:emailAuthPlaceholder')}
                        className="focus-visible:ring-0"
                      />
                    </FormControl>
                    <span className={cn('text-link', !countdown && 'cursor-pointer')} onClick={handleSendCode}>
                      {countdown ? `${Math.round(countdown / 1000)}s` : t('common:send')}
                    </span>
                  </div>
                  <FormMessage />
                  <span
                    className="text-link cursor-pointer text-sm"
                    onClick={() => setVerifyType(verifyType === VerifyType.email ? VerifyType.sms : VerifyType.email)}
                  >
                    {verifyType === VerifyType.email ? t('withdrawal:switchPhone') : t('withdrawal:switchEmail')}
                  </span>
                </FormItem>
              )}
            />
            {hasGaKey && (
              <FormField
                control={form.control}
                name="gaCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('withdrawal:googleAuth')}</FormLabel>
                    <FormControl>
                      <Input {...field} autoCapitalize="off" placeholder={t('withdrawal:googleAuthPlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <DialogFooter>
            <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
              {isPending && <Loader2Icon className="animate-spin" />}
              {t('common:next')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawModal
