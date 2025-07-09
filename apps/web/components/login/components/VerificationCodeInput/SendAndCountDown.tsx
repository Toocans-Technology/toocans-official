'use client'

import { Button, Form } from 'antd'
import { useState } from 'react'
import { useT } from '@/i18n'
import { useCodeByEmail, useCodeByMobile } from '@/services/login'
import { openToast } from '@/utils'
import { useLoginContext } from '../../LoginContext'
import { GrantType } from '../../data'
import { matchEmail, matchPhoneNum } from '../../utils'

const SendAndCountDown = () => {
  const { t } = useT('login')
  const { seconds, setSeconds, grantType } = useLoginContext()
  const { formData } = useLoginContext()

  const email = Form.useWatch('email', formData)
  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  const [selfEmail, setSelfEmail] = useState('')
  const [selfPhone, setSelfPhone] = useState('')
  const [selfNationalCode, setSelfNationalCode] = useState('')

  useCodeByEmail({ email: selfEmail })
  useCodeByMobile({ mobile: selfPhone, nationalCode: selfNationalCode })

  const handleSendCode = () => {
    if (seconds < 60) return

    try {
      if (grantType == GrantType.EMAIL) {
        setSelfEmail(email)
      } else {
        setSelfPhone(phone)
        setSelfNationalCode(nationalCode)
      }

      openToast(t('sendSuccessfully'))
      setSeconds(60)

      const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      openToast((error as Error).message, 'error')
    }
  }

  return (
    <Button
      className="right-1 top-[5px]"
      type="link"
      onClick={handleSendCode}
      disabled={
        seconds < 60 ||
        (grantType == GrantType.EMAIL && !matchEmail(email)) ||
        (grantType == GrantType.SMS && !matchPhoneNum(nationalCode, phone))
      }
      style={{ position: 'absolute' }}
    >
      {seconds == 60 ? t('send') : seconds}
    </Button>
  )
}

export default SendAndCountDown
