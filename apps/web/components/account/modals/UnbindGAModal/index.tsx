'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button, DialogFooter, FormMessage, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, toast } from '@workspace/ui/components'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@workspace/ui/components'
import { Input } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { VERIFICATION_CODE_REGEX } from '@/lib/utils'
import { useUserInfo } from '@/services/user'
import { useUnbindGoogleAuth } from '@/services/user'
import { HttpError } from '@/types/http'

const UnbindGAModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { data: userInfo, refetch } = useUserInfo()
  const { mutateAsync: mutateUnbindGoogleAuth, isPending } = useUnbindGoogleAuth()

  const FormSchema = useMemo(
    () =>
      z.object({
        code: z.string().regex(VERIFICATION_CODE_REGEX, t('account:verificationCodeError')).length(6),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  })
  const { handleSubmit, formState, reset } = form

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!userInfo) {
        return
      }

      try {
        await mutateUnbindGoogleAuth(data)
        refetch()
        setOpen(false)
        toast.success(t('account:unbindGoogleAuthSuccess'))
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateUnbindGoogleAuth, refetch, userInfo]
  )

  const handleCancel = useCallback(() => {
    setOpen(false)
    reset()
  }, [reset])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" variant="secondary">
          {t('common:disable')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('account:unbindGoogleAuth')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <div className="mt-4 grid gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account:google2FA')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-sm" placeholder={t('account:google2FAPlaceholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button rounded="full" variant="secondary" onClick={handleCancel}>
            {t('common:cancel')}
          </Button>
          <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
            {isPending && <Loader2Icon className="animate-spin" />}
            {t('common:confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UnbindGAModal
