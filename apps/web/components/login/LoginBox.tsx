'use client'

import { FunctionComponent, useState, useRef, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { LoginContext } from './LoginContext'
import {
  CheckComp,
  VerificationCode,
  NotCode,
  EmailInput,
  PhoneInput,
  PasswordInput,
  SwitchTabs,
} from './components/index'
import { matchEmail, matchPhoneNum } from './utils'

const LoginBox: FunctionComponent = () => {
  const { t } = useT('login')

  const checkBoxRef: any = useRef(null)

  const formData = useForm({
    defaultValues: {
      email: '', // 邮箱
      phone: '', // 手机号
      nationalCode: '', // 国家代码
      code: '', // 验证码
      password: '', // 密码
      check1: true,
      check2: true,
    },
  })

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = formData

  // 验证类型
  const [verifiType, setVerifiType] = useState<string | 'email' | 'phone'>('email')
  // 登录类型
  const [loginType, setLoginType] = useState<string | 'pwd' | 'code'>('code')
  // 国家选择框展示
  const [cuntrysVisible, setCuntrysVisible] = useState(false)
  // 选取问题, 选中后开启手机号blur校验
  const [phoneCheckState, setPhoneCheckState] = useState(false)
  // 倒计时
  const [seconds, setSeconds] = useState(60)

  const stateReset = () => {
    reset()
    setCuntrysVisible(false)
    setPhoneCheckState(false)
  }

  const onSubmit = (data: any) => {
    if (verifiType == 'email' && !matchEmail(data.email) && !errors.email) {
      setError('email', { type: 'custom', message: t('formatErr.email') })
      return
    }
    if (verifiType == 'phone' && !matchPhoneNum(data.nationalCode, data.phone) && !errors.phone) {
      setError('phone', { type: 'custom', message: t('formatErr.phone') })
      return
    }
    if (loginType == 'code' && data.code.length != 6 && !errors.code) {
      setError('code', { type: 'custom', message: t('formatErr.code') })
      return
    }
    if (!data.check1 && checkBoxRef.current) {
      checkBoxRef.current.openShak1()
      return
    }
    if (!data.check2 && checkBoxRef.current) {
      checkBoxRef.current.openShak2()
      return
    }
    // console.log(data)
  }

  return (
    <LoginContext.Provider
      value={{
        formData,
        verifiType,
        setVerifiType,
        loginType,
        setLoginType,
        seconds,
        setSeconds,
        cuntrysVisible,
        setCuntrysVisible,
        phoneCheckState,
        setPhoneCheckState,
        stateReset,
      }}
    >
      <div className="flex flex-1 content-center bg-[#f1f1f1]">
        <div className="mt-35 ml-35">
          <p className="title text-2xl font-medium">
            {t('login:title')} {t('login:name')}
          </p>
          <div
            className="w-108 min-h-100 mt-4 rounded-2xl bg-white p-6"
            style={{ boxShadow: '10px 19px 250px 0px rgba(0, 0, 0, 0.22)' }}
          >
            <SwitchTabs />

            {/* email input */}
            {verifiType == 'email' && <EmailInput />}

            {/* phone input */}
            {verifiType == 'phone' && <PhoneInput />}

            <p className={'mt-4 select-none'}>{t(loginType == 'code' ? 'verificationCode' : 'password')}</p>

            {/* Verification Code input */}
            {loginType == 'code' && <VerificationCode />}

            {/* password input */}
            {loginType == 'pwd' && <PasswordInput />}

            <div className="mt-4 flex cursor-pointer select-none">
              {seconds == 60 ? (
                <>
                  <p
                    className="text-xs text-[#3C7BF4]"
                    onClick={() => setLoginType(loginType == 'code' ? 'pwd' : 'code')}
                  >
                    {t(loginType == 'code' ? 'switchToPwd' : 'switchToCode')}
                  </p>
                  {loginType == 'pwd' && <p className="ml-auto text-xs text-[#3C7BF4]">{t('forgotPassword')}</p>}
                </>
              ) : (
                <NotCode />
              )}
            </div>

            <Button onClick={handleSubmit(onSubmit)} className="mt-[36px] w-full rounded-[40px] text-base text-black">
              {t('login')}
            </Button>

            <CheckComp ref={checkBoxRef} />
          </div>
        </div>
      </div>
    </LoginContext.Provider>
  )
}

export default LoginBox
