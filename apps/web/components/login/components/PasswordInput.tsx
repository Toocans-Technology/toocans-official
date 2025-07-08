'use client'

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const PasswordInput = () => {
  const { t } = useT('login')
  const { formData } = useLoginContext()

  return (
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: '',
          validator: (_rule, value) => {
            if (value?.length > 8 && value?.length < 32) {
              return Promise.resolve()
            } else {
              return Promise.reject(t('formatErr.pwd'))
            }
          },
        },
      ]}
      validateTrigger="onBlur"
      style={{ marginTop: '8px' }}
    >
      <Input.Password
        maxLength={32}
        minLength={8}
        placeholder={t('login:enter.pwd')}
        autoComplete="off"
        onFocus={() => {
          if (formData.getFieldError('password')) {
            formData.setFieldValue('password', formData.getFieldValue('password'))
          }
        }}
        iconRender={(visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
    </Form.Item>
  )
}

export default PasswordInput
