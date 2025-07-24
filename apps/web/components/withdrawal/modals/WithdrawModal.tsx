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
import { VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { useUserInfo } from '@/services/user/info'
import { getWithdrawOrder, useSendCode, useWithdraw, Withdrawal } from '@/services/wallet'
import { HttpError } from '@/types/http'
import { VerifyType } from '@/types/withdraw'

const COUNT_DOWN = 59 * 1000

interface Props {
  token: Token
  address: string
  amount: number
  disabled?: boolean
  tokenFee: string | number
  openDetail?: (open: boolean, data: Withdrawal) => void
}

const WithdrawModal: FunctionComponent<Props> = ({ address, token, amount, tokenFee, openDetail, disabled = true }) => {
  const { data: userInfo } = useUserInfo()
  const hasGaKey = userInfo?.hasGaKey ?? false
  const { t } = useT(['withdrawal', 'common'])
  const [open, setOpen] = useState(false)
  const [verifyType, setVerifyType] = useState<VerifyType>(VerifyType.email)
  const [targetDate, setTargetDate] = useState<number>()
  const { mutateAsync: mutateSendCode } = useSendCode()
  const { mutateAsync: mutateWithdraw, isPending } = useWithdraw()
  const { refetch } = getWithdrawOrder({ pageNo: 1, pageSize: 10, tokenId: token.tokenId })

  const FormSchema = useMemo(
    () =>
      z.object({
        code: z.string().regex(VERIFICATION_CODE_REGEX, t('withdrawal:withdrawModal.codeError')).length(6),
        gaCode: hasGaKey
          ? z.string().regex(VERIFICATION_CODE_REGEX, t('withdrawal:withdrawModal.gaCodeError')).length(6)
          : z.string().optional(),
      }),
    [hasGaKey]
  )

  useEffect(() => {
    if (userInfo?.email) {
      setVerifyType(VerifyType.email)
    } else {
      setVerifyType(VerifyType.sms)
    }
  }, [open, userInfo])

  const showSwitchVerifyType = useMemo(() => {
    if (!userInfo) {
      return false
    }
    return userInfo.email && userInfo.mobile
  }, [userInfo])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      gaCode: '',
    },
  })
  const { handleSubmit, reset, formState } = form

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined)
    },
  })

  const onOpenChange = useCallback(
    (open: boolean) => {
      reset()
      setOpen(open)
      setTargetDate(undefined)
    },
    [reset]
  )

  const handleSendCode = useCallback(() => {
    if (countdown) {
      return
    }

    mutateSendCode({ type: verifyType })
    setTargetDate(Date.now() + COUNT_DOWN)
  }, [mutateSendCode, verifyType, countdown])

  const formLabel = useMemo(() => {
    if (verifyType === VerifyType.email) {
      return countdown ? t('withdrawal:emailVerification', { email: userInfo?.email }) : t('withdrawal:emailAuth')
    }
    return countdown ? t('withdrawal:phoneVerification', { phone: userInfo?.concatMobile }) : t('withdrawal:phoneAuth')
  }, [verifyType, countdown])

  const handleSwitchVerifyType = useCallback(() => {
    setVerifyType(verifyType === VerifyType.email ? VerifyType.sms : VerifyType.email)
    setTargetDate(undefined)
  }, [verifyType])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        const res = await mutateWithdraw({
          ...data,
          address,
          amount,
          tokenFee: Number(tokenFee),
          tokenId: token.tokenId,
          accountId: userInfo.accountId,
          chargeType: token.tokenSetting?.withdrawChargeType,
        })

        if (!res) {
          return
        }

        setOpen(false)
        reset()
        refetch()
        openDetail?.(true, res)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateWithdraw, address, amount, tokenFee, token, reset, userInfo, refetch]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          fullWidth
          rounded="full"
          disabled={disabled}
          className="mt-4 max-w-[456px]"
          onClick={() => setOpen(true)}
        >
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
                  <FormLabel>{formLabel}</FormLabel>
                  <div
                    aria-invalid={formState.errors.code ? true : false}
                    className="focus-within:border-ring focus-within:ring-primary aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-4 overflow-hidden rounded-md bg-[#f8f8f8] pr-4 focus-within:ring-[1px]"
                  >
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={6}
                        autoComplete="off"
                        placeholder={t('withdrawal:emailAuthPlaceholder')}
                        className="aria-invalid:ring-0 focus-visible:ring-0"
                      />
                    </FormControl>
                    <span className={cn('text-link', !countdown && 'cursor-pointer')} onClick={handleSendCode}>
                      {countdown ? `${Math.round(countdown / 1000)}s` : t('common:send')}
                    </span>
                  </div>
                  <FormMessage />
                  {showSwitchVerifyType && (
                    <span className="text-link cursor-pointer text-sm" onClick={handleSwitchVerifyType}>
                      {verifyType === VerifyType.email ? t('withdrawal:switchPhone') : t('withdrawal:switchEmail')}
                    </span>
                  )}
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
                      <Input
                        {...field}
                        maxLength={6}
                        autoComplete="off"
                        placeholder={t('withdrawal:googleAuthPlaceholder')}
                      />
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
