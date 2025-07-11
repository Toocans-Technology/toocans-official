'use client'

import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useT } from '@/i18n'
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
          message: '',
          validator: (_rule, value) => {
            if (value?.length > 8 && value?.length < 32) {
              return Promise.resolve()
            } else {
              return Promise.reject(t('formatErr', { name: t('password') }))
            }
          },
        },
      ]}
    >
      <Input.Password
        maxLength={32}
        minLength={8}
        allowClear
        placeholder={t('enter', { name: t('password') })}
        autoComplete="off"
        onFocus={() => {
          if (formData.getFieldError('password')) {
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
