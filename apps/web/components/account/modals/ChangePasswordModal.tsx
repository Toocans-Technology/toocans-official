'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { useT } from '@/i18n'
import { useUserInfo } from '@/services/user'
import { useUpdatePassword } from '@/services/user'
import { HttpError } from '@/types/http'

const ChangePasswordModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { data: userInfo, refetch } = useUserInfo()
  const { mutateAsync: mutateUpdatePassword, isPending } = useUpdatePassword()

  const FormSchema = useMemo(
    () =>
      z.object({
        password: z.string().min(8).max(32),
        oldPassword: z.string().min(8).max(32),
        code: z.string().min(6).max(6),
      }),
    []
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      code: '',
    },
  })
  const { handleSubmit, reset, formState } = form

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        const res = await mutateUpdatePassword(data)

        if (!res) {
          return
        }

        refetch()
        setOpen(false)
        reset()
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUpdatePassword, refetch, userInfo]
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
          <DialogTitle>{t('account:changePassword')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <div className="gap-7.5 mt-4 grid">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoCapitalize="off"
                      className="rounded-sm"
                      placeholder={t('account:passwordPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:newPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoCapitalize="off"
                      className="rounded-sm"
                      placeholder={t('account:newPasswordPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:verificationCode')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoCapitalize="off"
                      className="rounded-sm"
                      placeholder={t('account:verificationCode')}
                    />
                  </FormControl>
                  <FormMessage />
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

export default ChangePasswordModal
