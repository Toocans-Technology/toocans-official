'use client'

import { Button, Form } from 'antd'
import { useT } from '@/i18n'
import { useCodeByEmail, useCodeByMobile } from '@/services/login'
import { openToast } from '@/utils'
import { matchEmail, matchPhoneNum } from '@/utils'
import { useLoginContext } from '../../LoginContext'
import { GrantType } from '../../data'

const SendAndCountDown = () => {
  const { t } = useT('login')
  const { seconds, setSeconds, grantType } = useLoginContext()
  const { formData } = useLoginContext()

  const email = Form.useWatch('email', formData)
  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  const { mutateAsync: fetchCodeByEmail } = useCodeByEmail()
  const { mutateAsync: fetchCodeByMobile } = useCodeByMobile()

  const handleSendCode = () => {
    if (seconds < 60) return

    try {
      if (grantType == GrantType.EMAIL) {
        fetchCodeByEmail({ email })
      } else {
        fetchCodeByMobile({ mobile: phone, nationalCode })
      }

      const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 60
          }
          return prev - 1
        })
      }, 1000)
      openToast(t('successfully', { name: t('send') }))
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
      {seconds == 60 ? t('send') : `${seconds} s`}
    </Button>
  )
}

export default SendAndCountDown
