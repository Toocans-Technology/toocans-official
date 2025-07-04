'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useState } from 'react'
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
import { getEmailCode } from '@/services/resource'
import { useWithdraw } from '@/services/wallet'
import { HttpError } from '@/types/http'

const FormSchema = z.object({
  code: z.string().min(6).max(6),
  gaCode: z.string().min(6).max(6),
})

interface Props {
  token: Token
  accountId: number
  address: string
  amount: number
  tokenFee: number
  disabled?: boolean
}

const WithdrawModal: FunctionComponent<Props> = ({ accountId, address, token, amount, tokenFee, disabled = true }) => {
  const { t } = useT(['withdrawal', 'common'])
  const [email, setEmail] = useState<string>('')
  const [targetDate, setTargetDate] = useState<number>()
  const { refetch } = getEmailCode({ email })
  const { mutateAsync: mutateWithdraw, isPending } = useWithdraw()
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

    // TODO: 获取用户邮箱
    setEmail('chacha@bdy.tech')
    refetch()
    setTargetDate(Date.now() + 59 * 1000)
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('withdrawal:emailAuth')}</FormLabel>
                  <div className="focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
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
                </FormItem>
              )}
            />
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
