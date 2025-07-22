import { Form, Button, Input } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import { GrantType } from '@/components/login/data'
import { RouterContext } from '@/components/providers'
import { useT } from '@/i18n'
import { useCodeByEmail, useCodeByMobile, useLogin } from '@/services/login'
import { openToast } from '@/utils'
import { matchEmail, matchPhoneNum } from '@/utils'
import { useForgetContext } from '../ForgetContext'
import styles from '../assets/style.module.scss'

const VerificationCode = () => {
  const { t } = useT('login')

  const router = useContext(RouterContext)

  const routerParams = useSearchParams()

  const urlEmail = routerParams.get('email') || ''
  const urlPhone = routerParams.get('phone') || ''
  const urlNationalCode = routerParams.get('nationalCode') || ''

  const { grantType, setStep, setUserToken } = useForgetContext()
  const { mutateAsync: fetchCodeByEmail } = useCodeByEmail()
  const { mutateAsync: fetchCodeByMobile } = useCodeByMobile()
  const { mutateAsync: handleLogin } = useLogin()

  let timer: ReturnType<typeof setInterval> | null = null

  // 倒计时
  const [seconds, setSeconds] = useState(60)

  const handleSendCode = () => {
    if (seconds < 60) return
    try {
      if (grantType == GrantType.EMAIL) {
        fetchCodeByEmail({ email: urlEmail })
      } else {
        fetchCodeByMobile({
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
      clientId: 'c247a83b04de19a955f9899a485fd330',
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
      const { access_token } = await handleLogin(resultParams)
      setUserToken(access_token)
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
      <p className="mt-4 text-[12px]">
        {t('verificationCodeTip', {
          type: grantType == GrantType.EMAIL ? 'email' : 'phone',
          address: grantType == GrantType.EMAIL ? urlEmail : `${urlNationalCode} ${urlPhone}`,
        })}
      </p>
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
