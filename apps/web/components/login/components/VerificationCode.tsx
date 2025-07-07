'use client'

import { isValidNumber } from 'libphonenumber-js'
import { CircleX } from 'lucide-react'
import { useCallback, useRef, useState, useEffect } from 'react'
import { Input, Button } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'
import { matchPhoneNum, matchEmail } from '../utils'
import { CountDownFetch } from './index'

const VerificationCode = () => {
  const { t } = useT('login')
  const { seconds, setSeconds, formData } = useLoginContext()
  const {
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = formData

  const phoneValue = watch('phone')
  const emailValue = watch('email')
  const codeValue = watch('code')
  const nationalCodeValue = watch('nationalCode')

  const timerRef: any = useRef(null)

  const handleGetCode = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (seconds == 0) clearInterval(timerRef.current)
    }
  }, [seconds])

  return (
    <>
      <div className="relative">
        <Input
          {...register('code', {
            onBlur: () => {
              if (codeValue.length != 6) {
                setError('code', { type: 'custom', message: t('formatErr.code') })
              }
            },
          })}
          maxLength={6}
          type="text"
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, '')
            setValue('code', value, { shouldValidate: true })
          }}
          placeholder={t('login:enter.code')}
          aria-invalid={!!errors.code?.message}
          className="mt-2 bg-[#f8f8f8]"
        />

        {codeValue && (
          <Button
            className={cn(
              'absolute top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent',
              matchEmail(emailValue) || matchPhoneNum(nationalCodeValue, phoneValue) ? 'right-10' : 'right-1'
            )}
            type="button"
            variant="ghost"
            onClick={() => setValue('code', '')}
          >
            <CircleX />
          </Button>
        )}

        {(matchEmail(emailValue) || matchPhoneNum(nationalCodeValue, phoneValue)) && (
          <Button
            className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs text-[#3C7BF4] hover:bg-transparent hover:text-[#3C7BF4]"
            variant="ghost"
            type="button"
            disabled={seconds < 60}
            onClick={handleGetCode}
          >
            {seconds === 60 ? t('send') : seconds}
          </Button>
        )}
        {seconds < 60 && <CountDownFetch />}
      </div>
      {errors.code?.message && <p className="text-destructive mt-2 text-[12px]">{errors.code?.message}</p>}
    </>
  )
}

export default VerificationCode
