import { Form, Button, Input } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import { GrantType } from '@/components/login/data'
import { RouterContext } from '@/components/providers'
import { useT } from '@/i18n'
import { useCodeByEmail, useCodeByMobile } from '@/services/login'
import { useLogin } from '@/services/login'
import { openToast } from '@/utils'
import { matchEmail, matchPhoneNum } from '@/utils'
import { useForgetContext } from '../ForgetContext'
import styles from '../assets/style.module.scss'

const VerificationCode = () => {
  const { t } = useT('login')
  const router = useContext(RouterContext)

  const { grantType, setStep } = useForgetContext()

  const routerParams = useSearchParams()

  const urlEmail = routerParams.get('email') || ''
  const urlPhone = routerParams.get('phone') || ''
  const urlNationalCode = routerParams.get('nationalCode') || ''

  let timer: NodeJS.Timeout | null = null

  const [selfEmail, setSelfEmail] = useState('')
  const [selfPhoneData, setSelfPhoneData] = useState({ mobile: '', nationalCode: '' })
  const { mutateAsync: handleLogin } = useLogin()

  useCodeByEmail({ email: selfEmail })
  useCodeByMobile({
    mobile: selfPhoneData.mobile,
    nationalCode: selfPhoneData.nationalCode,
  })

  // 倒计时
  const [seconds, setSeconds] = useState(60)

  const handleSendCode = () => {
    if (seconds < 60) return
    try {
      // 上线前放开
      if (grantType == GrantType.EMAIL) {
        setSelfEmail(urlEmail)
      } else {
        setSelfPhoneData({
          mobile: urlPhone,
          nationalCode: urlNationalCode,
        })
      }

      setSeconds(59)

      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            timer && clearInterval(timer)
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

  const changInput = async (value: string) => {
    const resultParams = {
      clientId: '24b5d2a7f4714409b4cc60bafc1dd2f6',
      code: null,
      uuid: null,
      channel: null,
      source: null,
      inputInviteCode: null,
      appInfo: null,
    }

    if (grantType == GrantType.EMAIL) {
      Object.assign(resultParams, {
        grantType,
        email: urlEmail,
        emailCode: value,
      })
    } else {
      Object.assign(resultParams, {
        grantType,
        nationalCode: urlNationalCode,
        phonenumber: urlPhone,
        smsCode: value,
      })
    }

    try {
      await handleLogin(resultParams)
      setStep(1)
    } catch (error) {
      openToast((error as Error).message, 'error')
    }
  }

  useEffect(() => {
    if (
      (grantType == GrantType.EMAIL && !matchEmail(urlEmail)) ||
      (grantType == GrantType.SMS && !matchPhoneNum(urlNationalCode, urlPhone))
    ) {
      grantType == GrantType.EMAIL
        ? openToast(t('formatErr', { name: `${t('email')} ${t('address')}` }), 'error')
        : openToast(t('formatErr', { name: `${t('phone')} ${t('number')}` }), 'error')

      router.replace('/login')
      return
    }

    handleSendCode()
    return () => {
      timer && clearInterval(timer)
      timer = null
    }
  }, [])

  return (
    <>
      <Form.Item name="code" className={styles.otpParent}>
        <Input.OTP type="text" formatter={(value) => value.replace(/[^\d]/g, '')} onChange={changInput} />
      </Form.Item>

      <Button
        className="mt-7 w-full"
        type="primary"
        onClick={handleSendCode}
        disabled={seconds < 60}
        style={{ fontWeight: 500 }}
      >
        {seconds == 60 ? t('send') : `${seconds}s`}
      </Button>
    </>
  )
}
export default VerificationCode
