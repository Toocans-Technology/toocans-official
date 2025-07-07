'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input, Button } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const PasswordInput = () => {
  const { t } = useT('login')
  const {
    formData: { register, watch },
  } = useLoginContext()

  const password = watch('password')

  const [pwdVisible, changePwdVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...register('password')}
        maxLength={32}
        minLength={8}
        type={pwdVisible ? 'text' : 'password'}
        placeholder={t('login:enter.pwd')}
        className="mt-2 bg-[#f8f8f8]"
      />

      {password && (
        <Button
          className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
          variant="ghost"
          type="button"
          onClick={() => changePwdVisible(!pwdVisible)}
        >
          {pwdVisible ? <EyeOff /> : <Eye />}
        </Button>
      )}
    </div>
  )
}

export default PasswordInput
