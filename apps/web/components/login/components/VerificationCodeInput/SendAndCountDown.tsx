'use client'

import { Button, Form, notification } from 'antd'
import { useT } from '@/i18n'
import { useCodeByEmail, useCodeByMobile } from '@/services/login'
import { useLoginContext } from '../../LoginContext'
import { matchEmail, matchPhoneNum } from '../../utils'

const SendAndCountDown = () => {
  const { t } = useT('login')
  const { seconds, setSeconds, grantType } = useLoginContext()
  const { formData } = useLoginContext()

  const email = Form.useWatch('email', formData)
  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  // TODO: 有email自动触发 send
  const codeByEmailQuery = useCodeByEmail({ email })
  const codeByMobileQuery = useCodeByMobile({ mobile: phone, nationalCode })

  const handleSendCode = () => {
    if (seconds < 60) return

    try {
      grantType == 'email' ? codeByEmailQuery.refetch() : codeByMobileQuery.refetch()
      notification.success({
        message: t('sendSuccessfully'),
        placement: 'top',
      })
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
      notification.error({
        message: (error as Error).message,
        placement: 'top',
      })
    }
  }

  return (
    <Button
      className="right-1 top-[5px]"
      type="link"
      onClick={handleSendCode}
      disabled={
        seconds < 60 ||
        (grantType == 'email' && !matchEmail(email)) ||
        (grantType == 'sms' && !matchPhoneNum(nationalCode, phone))
      }
      style={{ position: 'absolute' }}
    >
      {seconds == 60 ? t('send') : seconds}
    </Button>
  )
}

export default SendAndCountDown
