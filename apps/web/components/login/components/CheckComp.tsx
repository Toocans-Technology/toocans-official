'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Checkbox, Label } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import Link from '@/components/Link'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'
import '../assets/style.css'

const CheckComp = (_props: any, ref: any) => {
  const { t } = useT('login')
  const { formData } = useLoginContext()
  const { register, setValue, watch } = formData

  const checkVal1 = watch('check1')
  const checkVal2 = watch('check2')
  const [shak, setShak] = useState(0)

  useImperativeHandle(ref, () => ({
    openShak1() {
      setShak(1)
      setTimeout(() => setShak(0), 500)
    },
    openShak2() {
      setShak(2)
      setTimeout(() => setShak(0), 500)
    },
  }))

  return (
    <>
      <div className={cn('mt-2', 'flex', 'space-x-2', shak == 1 && 'shake')}>
        <Checkbox
          id="unregisteredTip"
          checked={checkVal1}
          className="mt-1 h-3 w-3 cursor-pointer"
          {...register('check1')}
          onClick={() => setValue('check1', !checkVal1)}
        />
        <Label htmlFor="unregisteredTip" className="w-[85%] leading-[18px] text-[#666]">
          {t('unregisteredTip')}
        </Label>
      </div>

      <div className={cn('mt-2', 'flex', 'space-x-2', shak == 2 && 'shake')}>
        <Checkbox
          checked={checkVal2}
          id="userAgreement"
          className="mt-1 h-3 w-3 cursor-pointer"
          {...register('check2')}
          onClick={() => setValue('check2', !checkVal2)}
        />
        <Label htmlFor="userAgreement" className="flex flex-wrap text-[#666]">
          {t('agreedTip')}
          <Link href="#" className="text-[#3c7bf4]">
            {t('name')}
          </Link>
          <Link href="#" className="text-[#3c7bf4]">
            {t('userAgreement')}
          </Link>
          {t('and')}
          <Link href="#" className="text-[#3c7bf4]">
            {t('privacyPolicy')}
          </Link>
        </Label>
      </div>
    </>
  )
}

export default forwardRef(CheckComp)
