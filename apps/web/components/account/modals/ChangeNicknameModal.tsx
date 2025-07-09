'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
  Input,
  Separator,
  toast,
} from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useUserInfo } from '@/services/user'
import { useUpdateNickname } from '@/services/user/updateNickname'
import { HttpError } from '@/types/http'

const ChangeNicknameModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { data: userInfo, refetch } = useUserInfo()
  const { mutateAsync: mutateUpdateNickname, isPending } = useUpdateNickname()

  const FormSchema = useMemo(
    () =>
      z.object({
        nickname: z.string().min(5).max(20),
      }),
    []
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nickname: userInfo?.nickname || '',
    },
  })
  const { handleSubmit, setValue, formState } = form

  useEffect(() => {
    setValue('nickname', userInfo?.nickname || '')
  }, [userInfo])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        const res = await mutateUpdateNickname(data)

        if (!res) {
          return
        }

        refetch()
        setOpen(false)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUpdateNickname, refetch, userInfo]
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
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:changeNickname')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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

export default ChangeNicknameModal
