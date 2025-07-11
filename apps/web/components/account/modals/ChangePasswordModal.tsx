'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { ControllerRenderProps, FormState, useForm } from 'react-hook-form'
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
import { useAddPassword } from '@/services/user'
import { HttpError } from '@/types/http'

interface PasswordInputProps {
  placeholder?: string
  formState: FormState<{
    password: string
    oldPassword: string
  }>
  field: ControllerRenderProps<
    {
      password: string
      oldPassword: string
    },
    'oldPassword' | 'password'
  >
}

const PasswordInput = ({ formState, field, placeholder }: PasswordInputProps) => {
  const [show, setShow] = useState(false)

  return (
    <div
      aria-invalid={formState.errors.password ? true : false}
      className="aria-invalid:border-destructive aria-invalid:ring-destructive aria-invalid:ring-[1px] focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-3 focus-within:ring-[1px]"
    >
      <Input
        {...field}
        maxLength={32}
        autoComplete="off"
        type={show ? 'text' : 'password'}
        className="aria-invalid:ring-0 rounded-sm focus-visible:ring-0"
        placeholder={placeholder}
      />
      <span onClick={() => setShow(!show)} className="cursor-pointer">
        {show ? <Eye color="#666" strokeWidth={1.5} size={16} /> : <EyeOff color="#666" strokeWidth={1.5} size={16} />}
      </span>
    </div>
  )
}

const ChangePasswordModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: mutateAddPassword, isPending } = useAddPassword()

  const FormSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().nonempty(t('account:newPasswordPlaceholder')).min(8).max(32),
          oldPassword: z.string().nonempty(t('account:passwordPlaceholder')).min(8).max(32),
        })
        .refine((data) => data.password === data.oldPassword, {
          message: t('account:passwordError'),
          path: ['password'],
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
  const { handleSubmit, reset, formState } = form

  useEffect(() => {
    return () => {
      reset()
    }
  }, [open])

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await mutateAddPassword({
          password: data.password,
        })

        toast.success(t('account:changePasswordSuccess'))
        setOpen(false)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [mutateAddPassword]
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
                    <PasswordInput formState={formState} field={field} placeholder={t('account:passwordPlaceholder')} />
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
                    <PasswordInput
                      formState={formState}
                      field={field}
                      placeholder={t('account:newPasswordPlaceholder')}
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
