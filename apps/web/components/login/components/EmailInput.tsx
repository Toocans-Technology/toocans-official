'use client'

import { CircleX } from 'lucide-react'
import { Input, Button } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'
import { matchEmail } from '../utils'

const EmailInput = () => {
  const { t } = useT('login')
  const { seconds, formData } = useLoginContext()

  const {
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = formData

  const emailValue = watch('email')

  return (
    <>
      <div className="relative">
        <Input
          {...register('email', {
            onBlur: () => {
              if (!matchEmail(emailValue)) {
                setError('email', { type: 'custom', message: t('formatErr.email') })
              }
            },
          })}
          disabled={seconds < 60}
          maxLength={50}
          onFocus={() => setError('email', { type: 'custom', message: '' })}
          type="email"
          placeholder={t(`login:enter.email`)}
          className="mt-2 bg-[#f8f8f8]"
          aria-invalid={!!errors.email?.message}
        />

        {emailValue && seconds == 60 && (
          <Button
            type="button"
            className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
            variant="ghost"
            onClick={() => setValue('email', '')}
          >
            <CircleX />
          </Button>
        )}
      </div>
      {errors.email?.message && <p className="text-destructive mt-2 text-[12px]">{errors.email?.message}</p>}
    </>
  )
}

export default EmailInput
