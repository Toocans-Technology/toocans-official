'use client'

import { Form, Input } from 'antd'
import { useT } from '@/i18n'
import { useLoginContext } from '../../LoginContext'
import SendAndCountDown from './SendAndCountDown'

const VerificationCode = () => {
  const { t } = useT('login')
  const { formData } = useLoginContext()

  return (
    <div className="relative">
      <Form.Item
        name="code"
        rules={[
          { required: true, message: '' },
          {
            pattern: /^\d{6}$/,
            message: t('formatErr', { name: 'code' }),
          },
        ]}
        validateTrigger="onBlur"
        style={{ marginTop: '8px' }}
        className="relative"
      >
        <Input
          maxLength={6}
          type="text"
          placeholder={t('enter', { name: t('verificationCode') })}
          onChange={(e) => {
            // 只允许输入数字
            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
            formData.setFieldsValue({ code: value })
          }}
          onFocus={() => {
            if (formData.getFieldError('code')) {
              formData.setFields([
                {
                  name: ['code'],
                  errors: [],
                },
              ])
            }
          }}
        />
      </Form.Item>
      <SendAndCountDown />
    </div>
  )
}

export default VerificationCode
