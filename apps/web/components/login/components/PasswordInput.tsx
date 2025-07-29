'use client'

import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useT } from '@/i18n'
import { matchPassword, PasswordErrorType } from '@/utils'
import { useLoginContext } from '../LoginContext'

const PasswordInput = () => {
  const { t } = useT('login')
  const { formData } = useLoginContext()

  return (
    <Form.Item
      name="password"
      validateTrigger="onBlur"
      style={{ marginTop: '8px' }}
      rules={[
        {
          required: true,
          validator: (_rule, value) => {
            const matchResult = matchPassword(value)

            if (matchResult === true) {
              return Promise.resolve()
            } else {
              let msg = ''
              if (matchResult?.errorType == PasswordErrorType.lowercase) {
                msg = t('ruleTip.lowercase')
              }
              if (matchResult?.errorType == PasswordErrorType.uppercase) {
                msg = t('ruleTip.uppercase')
              }
              if (matchResult?.errorType == PasswordErrorType.number) {
                msg = t('ruleTip.number')
              }
              if (matchResult?.errorType == PasswordErrorType.length) {
                msg = t('ruleTip.length')
              }
              return Promise.reject(new Error(msg))
            }
          },
        },
      ]}
    >
      <Input.Password
        allowClear
        placeholder={t('enter', { name: t('password') })}
        autoComplete="off"
        onFocus={() => {
          if (formData.getFieldError('password')?.length) {
            formData.setFields([
              {
                name: ['password'],
                errors: [],
              },
            ])
          }
        }}
        iconRender={(visible: boolean) => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
      />
    </Form.Item>
  )
}

export default PasswordInput
