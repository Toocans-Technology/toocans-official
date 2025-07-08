'use client'

import { Form, Input } from 'antd'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const EmailInput = () => {
  const { t } = useT('login')
  const { seconds, formData } = useLoginContext()

  return (
    <Form.Item
      name="email"
      rules={[
        { required: true, message: '' },
        {
          pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/,
          message: t('formatErr.email'),
        },
      ]}
      validateTrigger="onBlur"
      style={{ marginTop: '8px' }}
    >
      <Input
        disabled={seconds < 60}
        maxLength={50}
        type="text"
        placeholder={t(`login:enter.email`)}
        allowClear
        onFocus={() => {
          if (formData.getFieldError('email')) {
            formData.setFieldValue('email', formData.getFieldValue('email'))
          }
        }}
      />
    </Form.Item>
  )
}

export default EmailInput
