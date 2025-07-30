'use client'

import { Form } from 'antd'
import { useSearchParams } from 'next/navigation'
import { FunctionComponent } from 'react'
import { useState } from 'react'
import { SwitchTabs } from '@/components/login/components'
import { GrantType } from '@/components/login/data'
import { useT } from '@/i18n'
import { ForgetContext } from './ForgetContext'
import ChangePassword from './components/ChangePassword'
import VerificationCode from './components/VerificationCode'

const ForgetBox: FunctionComponent = () => {
  const { t } = useT('login')
  const [form] = Form.useForm()
  const routerParams = useSearchParams()

  // 验证类型
  const [grantType, setGrantType] = useState<GrantType>(
    routerParams.get(GrantType.EMAIL) ? GrantType.EMAIL : GrantType.SMS
  )

  // 当前页面步骤, 0: 验证码, 1: 修改密码
  const [step, setStep] = useState(0)

  const stateReset = () => form.resetFields()

  const [userToken, setUserToken] = useState<string | null>(null)

  return (
    <ForgetContext.Provider
      value={{
        formData: form,
        grantType,
        userToken,
        setUserToken,
        setGrantType,
        step,
        setStep,
        stateReset,
      }}
    >
      <div className="flex flex-1 content-center bg-[#f1f1f1]">
        <div className="mt-45 ml-35">
          <p className="title text-2xl font-medium">{t('login:forgotPassword')}</p>
          <div
            className="w-108 min-h-50 mt-4 rounded-2xl bg-white p-6"
            style={{ boxShadow: '10px 19px 250px 0px rgba(0, 0, 0, 0.22)' }}
          >
            {step == 0 && <SwitchTabs />}

            <Form form={form}>
              {step == 0 && <VerificationCode />}
              {step == 1 && <ChangePassword />}
            </Form>
          </div>
        </div>
      </div>
    </ForgetContext.Provider>
  )
}

export default ForgetBox
