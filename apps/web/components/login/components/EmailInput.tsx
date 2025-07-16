'use client'

import { Form, Input } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { EmailReg } from '@/data'
import { useT } from '@/i18n'
import { useLoginContext } from '../LoginContext'

const EmailInput = () => {
  const { t } = useT('login')
  const { seconds, formData } = useLoginContext()
  const routerParams = useSearchParams()
  const urlEmail = routerParams.get('email') || ''

  useEffect(() => {
    urlEmail && formData.setFieldsValue({ email: urlEmail })
  }, [])

  return (
    <Form.Item
      name="email"
      rules={[
        { required: true, message: '' },
        {
          pattern: EmailReg,
          message: t('formatErr', { name: `${t('email')} ${t('address')}` }),
        },
      ]}
      validateTrigger="onBlur"
      style={{ marginTop: '8px' }}
    >
      <Input
        disabled={seconds < 60}
        maxLength={50}
        type="text"
        placeholder={t('enter', { name: t('email') })}
        allowClear
        onFocus={() => {
          if (formData.getFieldError('email')) {
            formData.setFields([
              {
                name: ['email'],
                errors: [],
              },
            ])
          }
        }}
      />
    </Form.Item>
  )
}

export default EmailInput
