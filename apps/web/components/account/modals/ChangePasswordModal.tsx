'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, Loader2Icon } from 'lucide-react'
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
import { useUpdatePassword } from '@/services/user'
import { HttpError } from '@/types/http'

const ChangePasswordModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: mutateUpdatePassword, isPending } = useUpdatePassword()

  const FormSchema = useMemo(
    () =>
      z.object({
        password: z.string().min(8).max(32),
        oldPassword: z.string().min(8).max(32),
      }),
    []
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
    },
  })
  const { handleSubmit, reset, watch, formState } = form

  const oldPassword = watch('oldPassword')
  const password = watch('password')

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        console.log('data', data)
        const res = await mutateUpdatePassword(data)

        if (!res) {
          return
        }

        setOpen(false)
        reset()
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUpdatePassword]
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
              rules={{
                required: true,
                minLength: 8,
                maxLength: 32,
                deps: ['password'],
                validate: (value) => value === password || t('account:passwordError'),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:password')}</FormLabel>
                  <div
                    aria-invalid={formState.errors.password ? true : false}
                    className="focus-within:border-ring focus-within:ring-primary aria-invalid:ring-destructive flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-3 focus-within:ring-[1px]"
                  >
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        maxLength={32}
                        autoComplete="off"
                        className="rounded-sm focus-visible:ring-0"
                        placeholder={t('account:passwordPlaceholder')}
                      />
                    </FormControl>
                    <Eye color="#666" strokeWidth={1.5} className="cursor-pointer" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: true,
                minLength: 8,
                maxLength: 32,
                deps: ['oldPassword'],
                validate: (value) => value === oldPassword || t('account:passwordError'),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:newPassword')}</FormLabel>
                  <div
                    aria-invalid={formState.errors.password ? true : false}
                    className="focus-within:border-ring focus-within:ring-primary aria-invalid:ring-destructive flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-3 focus-within:ring-[1px]"
                  >
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        maxLength={32}
                        autoComplete="off"
                        className="rounded-sm focus-visible:ring-0"
                        placeholder={t('account:newPasswordPlaceholder')}
                      />
                    </FormControl>
                    <Eye color="#666" strokeWidth={1.5} className="cursor-pointer" />
                  </div>
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
