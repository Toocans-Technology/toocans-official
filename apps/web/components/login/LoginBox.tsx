'use client'

import { Button, Form, notification } from 'antd'
import { FunctionComponent, useState, useRef, useCallback } from 'react'
import { useT } from '@/i18n'
import { typedStorage } from '@/lib/utils'
import { useLogin } from '@/services/login/login'
import { LoginContext } from './LoginContext'
import {
  SwitchTabs,
  EmailInput,
  PhoneInput,
  VerificationCode,
  PasswordInput,
  NotCode,
  CheckComp,
} from './components/index'

const LoginBox: FunctionComponent = () => {
  const { t } = useT('login')

  const [form] = Form.useForm()
  const checkBoxRef: any = useRef(null)

  // 验证类型
  const [grantType, setGrantType] = useState<string | 'email' | 'sms'>('email')
  // 登录类型
  const [loginType, setLoginType] = useState<string | 'pwd' | 'code'>('code')
  // 国家选择框展示
  const [cuntrysVisible, setCuntrysVisible] = useState(false)
  // 选取问题, 选中后开启手机号blur校验
  const [phoneCheckState, setPhoneCheckState] = useState(false)
  // 倒计时
  const [seconds, setSeconds] = useState(60)

  const { mutateAsync: handleLogin } = useLogin()

  const stateReset = () => {
    form.resetFields()
    setCuntrysVisible(false)
    setPhoneCheckState(false)
  }

  const onSubmit = useCallback(async (values: any) => {
    if (!values.unregisteredTip && checkBoxRef.current) {
      checkBoxRef.current.openShak1()
      return
    }
    if (!values.userAgreement && checkBoxRef.current) {
      checkBoxRef.current.openShak2()
      return
    }

    const resultParams = {
      clientId: '24b5d2a7f4714409b4cc60bafc1dd2f6',
      code: null,
      uuid: null,
      channel: null,
      source: null,
      inputInviteCode: null,
      appInfo: null,
    }

    if (loginType == 'pwd') {
      Object.assign(resultParams, {
        username: values.email || `${values.nationalCode}${values.phone}`,
        grantType: 'password',
        password: values.password,
      })
    } else {
      if (grantType == 'email') {
        Object.assign(resultParams, {
          grantType,
          email: values.email,
          emailCode: values.code,
        })
      } else {
        Object.assign(resultParams, {
          grantType,
          nationalCode: values.nationalCode,
          phonenumber: values.phone,
          smsCode: values.code,
        })
      }
    }

    try {
      const data = await handleLogin(resultParams)
      // TODO: log没数据
      console.log(data)
      // typedStorage.accessToken = res.data.access_token
      // typedStorage.refreshToken = res.data.refresh_token
      // typedStorage.expireIn = res.data.expire_in

      notification.success({
        message: t('loginSuccessfully'),
        placement: 'top',
      })
      // TODO: 登录成功以后?
    } catch (error) {
      notification.error({
        message: (error as Error).message,
        placement: 'top',
      })
    }
  }, [])

  return (
    <LoginContext.Provider
      value={{
        formData: form,
        grantType,
        setGrantType,
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

            <Form form={form} initialValues={{ unregisteredTip: true, userAgreement: true }} onFinish={onSubmit}>
              {/* email input */}
              {grantType == 'email' && <EmailInput />}

              {/* phone input */}
              {grantType == 'sms' && <PhoneInput />}

              <p className={'mt-4 select-none'}>{t(loginType == 'code' ? 'verificationCode' : 'password')}</p>

              {/* Verification Code input */}
              {loginType == 'code' && <VerificationCode />}

              {/* password input */}
              {loginType == 'pwd' && <PasswordInput />}

              <div className="mt-4 flex select-none">
                {seconds == 60 ? (
                  <>
                    <p
                      className="cursor-pointer text-xs text-[#3C7BF4]"
                      onClick={() => {
                        setLoginType(loginType == 'code' ? 'pwd' : 'code')
                        form.resetFields(loginType == 'code' ? ['password'] : ['code'])
                      }}
                    >
                      {t(loginType == 'code' ? 'switchToPwd' : 'switchToCode')}
                    </p>
                    {loginType == 'pwd' && (
                      <a href="#" className="ml-auto text-xs text-[#3C7BF4]">
                        {t('forgotPassword')}
                      </a>
                    )}
                  </>
                ) : (
                  <NotCode />
                )}
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="mt-[36px] w-full" style={{ fontWeight: 500 }}>
                  {t('login')}
                </Button>
              </Form.Item>

              <CheckComp ref={checkBoxRef} />
            </Form>
          </div>
        </div>
      </div>
    </LoginContext.Provider>
  )
}

export default LoginBox
