'use client'

import { Form, Input } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useT } from '@/i18n'
import { EMAIL_REGEX } from '@/lib/utils/constants'
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
          pattern: EMAIL_REGEX,
          message: t('login:formatErr', { name: `${t('login:email')} ${t('login:address')}` }),
        },
      ]}
      validateTrigger="onBlur"
      style={{ marginTop: '8px' }}
    >
      <Input
        disabled={seconds < 60}
        maxLength={50}
        type="text"
        placeholder={t('login:enter', { name: t('login:email') })}
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
