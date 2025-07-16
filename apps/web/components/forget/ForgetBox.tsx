'use client'

import { Form, Button } from 'antd'
import { throttle } from 'es-toolkit'
import { FunctionComponent } from 'react'
import { useState, useCallback } from 'react'
import { SwitchTabs } from '@/components/login/components'
import { GrantType } from '@/components/login/data'
import { useT } from '@/i18n'
import { ForgetContext } from './ForgetContext'
import ChangePassword from './components/ChangePassword'
import InputComp from './components/InputComp'
import VerificationCode from './components/VerificationCode'

const ForgetBox: FunctionComponent = () => {
  const { t } = useT('login')
  const [form] = Form.useForm()

  // 国家选择框展示
  const [cuntrysVisible, setCuntrysVisible] = useState(false)

  // 验证类型
  const [grantType, setGrantType] = useState<GrantType>(GrantType.EMAIL)

  // 当前页面步骤, 0: 输入邮箱/手机号, 1: 验证码, 2: 修改密码
  const [step, setStep] = useState(0)

  const stateReset = () => form.resetFields()

  return (
    <ForgetContext.Provider
      value={{
        formData: form,
        grantType,
        setGrantType,
        cuntrysVisible,
        setCuntrysVisible,
        step,
        setStep,
        stateReset,
      }}
    >
      <div className="flex flex-1 content-center bg-[#f1f1f1]">
        <div className="mt-45 ml-35">
          <p className="title text-2xl font-medium">{t('forgotPassword')}</p>
          <div
            className="w-108 min-h-50 mt-4 rounded-2xl bg-white p-6"
            style={{ boxShadow: '10px 19px 250px 0px rgba(0, 0, 0, 0.22)' }}
          >
            {step == 0 && <SwitchTabs />}

            <Form form={form}>
              {step == 0 && <InputComp />}
              {step == 1 && <VerificationCode />}
              {step == 2 && <ChangePassword />}
            </Form>
          </div>
        </div>
      </div>
    </ForgetContext.Provider>
  )
}

export default ForgetBox
