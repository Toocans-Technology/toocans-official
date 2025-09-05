'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useState } from 'react'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { UpdateWithdrawAddressReq, UpdateWithdrawAddressReqSchema, useUpdateWithdrawAddress } from '@/services/wallet'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { HttpError } from '@/types/http'

interface Props {
  data?: WithdrawAddress
  onSuccess?: () => void
}

const UpdateWithdrawAddressModal: FunctionComponent<Props> = ({ data, onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: mutateUpdateAddressName, isPending } = useUpdateWithdrawAddress()

  const form = useForm<UpdateWithdrawAddressReq>({
    resolver: zodResolver(UpdateWithdrawAddressReqSchema),
    defaultValues: {
      id: data?.id,
      addressName: data?.addressName || '',
    },
  })

  const { handleSubmit } = form

  const onSubmit = useCallback(
    async (data: UpdateWithdrawAddressReq) => {
      try {
        console.log('data', data)

        const res = await mutateUpdateAddressName(data)

        if (!res) {
          return
        }

        onSuccess?.()
        toast.success(t('withdrawAddress:changeNameSuccess'))
        setOpen?.(false)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUpdateAddressName, t, onSuccess]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open)
      form.reset()
    },
    [form]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
              <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('common:edit')}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawAddress:editName')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <div className="mt-4 grid gap-6">
            <FormField
              control={form.control}
              name="addressName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('withdrawAddress:addressName')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={20}
                      autoCapitalize="off"
                      className="rounded-sm"
                      placeholder={t('withdrawAddress:addressNamePlaceholder')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button rounded="full" variant="secondary" onClick={() => handleOpenChange(false)}>
              {t('common:cancel')}
            </Button>
            <Button rounded="full" disabled={isPending} onClick={handleSubmit(onSubmit)}>
              {isPending && <Loader2Icon className="animate-spin" />}
              {t('common:confirm')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateWithdrawAddressModal
