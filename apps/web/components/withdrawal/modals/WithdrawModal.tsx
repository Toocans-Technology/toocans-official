'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCountDown } from 'ahooks'
import { FunctionComponent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Form, Input, Label, Separator, toast } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
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
}

const WithdrawModal: FunctionComponent<Props> = ({ accountId, address, token, amount, tokenFee }) => {
  const { t } = useT(['withdrawal', 'common'])
  const [email, setEmail] = useState<string>('')
  const [targetDate, setTargetDate] = useState<number>()
  const { refetch } = getEmailCode({ email })
  const { mutateAsync: mutateWithdraw } = useWithdraw()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
      gaCode: '',
    },
  })
  const { register, handleSubmit } = form

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

    setEmail('chacha@bdy.tech')
    refetch()
    setTargetDate(Date.now() + 60 * 1000)
  }, [refetch, countdown])

  const handleWithdraw = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      console.log('data', data)
      try {
        await mutateWithdraw({
          ...data,
          accountId,
          address,
          amount,
          tokenFee,
          tokenId: token.tokenId,
        })
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateWithdraw, accountId, token, amount, address, tokenFee]
  )

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleWithdraw)}>
          <DialogTrigger asChild>
            <Button fullWidth rounded="full" className="mt-4 max-w-[456px]">
              {t('common:next')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('withdrawal:withdrawModal.title')}</DialogTitle>
              <Separator />
            </DialogHeader>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:network')}</div>
                <div className="text-right font-medium">TRC20</div>
              </div>
              <div className="grid grid-cols-2 py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:address')}</div>
                <div className="text-right font-medium">{address}</div>
              </div>
              <div className="grid grid-cols-2 py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:amount')}</div>
                <div className="text-right font-medium">{amount}</div>
              </div>
              <div className="grid grid-cols-2 py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</div>
                <div className="text-right font-medium">
                  {tokenFee} {token?.tokenName}
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">{t('withdrawal:emailAuth')}</Label>
                <div className="focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
                  <Input
                    id="code"
                    required
                    autoComplete="off"
                    className="flex-1 focus-visible:ring-0"
                    placeholder={t('withdrawal:emailAuthPlaceholder')}
                    {...register('code', { required: true, minLength: 6, maxLength: 6 })}
                  />
                  <span className="text-link cursor-pointer" onClick={handleSendCode}>
                    {countdown ? `${Math.round(countdown / 1000)}s` : t('common:send')}
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gaCode">{t('withdrawal:googleAuth')}</Label>
                <Input
                  id="gaCode"
                  required
                  autoComplete="off"
                  placeholder={t('withdrawal:googleAuthPlaceholder')}
                  {...register('gaCode', { required: true, minLength: 6, maxLength: 6 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" rounded="full">
                {t('common:next')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}

export default WithdrawModal
