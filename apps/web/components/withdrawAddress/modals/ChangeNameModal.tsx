'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Separator,
  toast,
} from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import {
  UpdateWithdrawAddressReq,
  UpdateWithdrawAddressReqSchema,
  useUpdateWithdrawAddress,
  useWithdrawAddressList,
} from '@/services/wallet'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { HttpError } from '@/types/http'

interface Props {
  data: WithdrawAddress
}

const ChangeNameModal: FunctionComponent<Props> = ({ data }) => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { refetch } = useWithdrawAddressList()
  const { mutateAsync: mutateUpdateAddressName, isPending } = useUpdateWithdrawAddress()

  const form = useForm<UpdateWithdrawAddressReq>({
    resolver: zodResolver(UpdateWithdrawAddressReqSchema),
    defaultValues: {
      id: data.id,
      addressName: data.addressName || '',
    },
  })
  const { handleSubmit, setValue, formState } = form

  useEffect(() => {
    setValue('addressName', data.addressName || '')
  }, [setValue, data])

  const onSubmit = useCallback(
    async (data: UpdateWithdrawAddressReq) => {
      if (!data) {
        return
      }

      try {
        const res = await mutateUpdateAddressName(data)

        if (!res) {
          return
        }

        toast.success(t('account:changeNicknameSuccess'))
        refetch()
        setOpen(false)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUpdateAddressName, refetch, t]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" variant="secondary">
          {t('common:change')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('account:changeNickname')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <div className="mt-4 grid gap-6">
            <FormField
              control={form.control}
              name="addressName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:changeNickname')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={20}
                      autoCapitalize="off"
                      className="rounded-sm"
                      placeholder={t('account:changeNicknamePlaceholder')}
                    />
                  </FormControl>
                  <p className="text-sm text-[#666]">{t('account:changeNicknameTips')}</p>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button rounded="full" variant="secondary" onClick={() => setOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
              {isPending && <Loader2Icon className="animate-spin" />}
              {t('common:confirm')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeNameModal
