'use client'

import { Button, Form } from 'antd'
import { throttle } from 'es-toolkit'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { FunctionComponent, useState, useRef, useCallback } from 'react'
import Link from '@/components/common/Link'
import { useT } from '@/i18n'
import { typedStorage } from '@/lib/utils'
import { useLogin } from '@/services/login'
import { openToast } from '@/utils'
import { LoginContext } from './LoginContext'
import { SwitchTabs, EmailInput, VerificationCode, PasswordInput, NotCode, CheckComp } from './components/index'
import { GrantType, LoginType } from './data'

const PhoneInput = dynamic(() => import('./components/PhoneInput'))

const LoginBox: FunctionComponent = () => {
  const { t } = useT('login')

  const routerParams = useSearchParams()
  const [form] = Form.useForm()
  const checkBoxRef: any = useRef(null)

  // 验证类型
  const [grantType, setGrantType] = useState<GrantType>(GrantType.EMAIL)
  // 登录类型
  const [loginType, setLoginType] = useState<LoginType>((routerParams.get('LoginType') as LoginType) || LoginType.CODE)
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

  const onSubmit = useCallback(
    throttle(async (values: { [key: string]: string }) => {
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

      if (loginType == LoginType.PASSWORD) {
        Object.assign(resultParams, {
          username: values.email || `${values.nationalCode}${values.phone}`,
          grantType: LoginType.PASSWORD,
          password: values.password,
        })
      } else {
        if (grantType == GrantType.EMAIL) {
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
        const { access_token, refresh_token, expires_in } = await handleLogin(resultParams)

        typedStorage.accessToken = access_token
        typedStorage.refreshToken = refresh_token
        typedStorage.expireIn = expires_in

        openToast(t('successfully', { name: t('login') }))
        router.replace('/overview')
      } catch (error) {
        openToast((error as Error).message, 'error')
      }
    }, 1000),
    []
  )

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
          <p className="title text-2xl font-medium">{t('welcome', { name: t('name') })}</p>
          <div
            className="w-108 min-h-100 mt-4 rounded-2xl bg-white p-6"
            style={{ boxShadow: '10px 19px 250px 0px rgba(0, 0, 0, 0.22)' }}
          >
            <SwitchTabs />

            <Form form={form} initialValues={{ unregisteredTip: false, userAgreement: false }} onFinish={onSubmit}>
              {/* email input */}
              {grantType == GrantType.EMAIL && <EmailInput />}

              {/* phone input */}
              {grantType == GrantType.SMS && <PhoneInput />}

              <p className={'mt-4 select-none'}>{t(loginType == LoginType.CODE ? 'verificationCode' : 'password')}</p>

              {/* Verification Code input */}
              {loginType == LoginType.CODE && <VerificationCode />}

              {/* password input */}
              {loginType == LoginType.PASSWORD && <PasswordInput />}

              <div className="mt-4 flex select-none">
                {seconds == 60 ? (
                  <>
                    <Link
                      href={`/login?LoginType=${loginType == LoginType.CODE ? LoginType.PASSWORD : LoginType.CODE}`}
                      replace
                      className="cursor-pointer text-xs text-[#3C7BF4]"
                      onClick={() => {
                        setLoginType(loginType == LoginType.CODE ? LoginType.PASSWORD : LoginType.CODE)
                        form.resetFields(loginType == LoginType.CODE ? ['password'] : ['code'])
                      }}
                    >
                      {t('switchTo', { type: loginType == LoginType.CODE ? LoginType.PASSWORD : LoginType.CODE })}
                    </Link>
                    {loginType == LoginType.PASSWORD && (
                      <Link href="/forget" className="ml-auto text-xs text-[#3C7BF4]">
                        {t('forgotPassword')}
                      </Link>
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
