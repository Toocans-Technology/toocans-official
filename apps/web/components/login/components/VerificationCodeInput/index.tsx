'use client'

import { Form, InputNumber } from 'antd'
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
        <InputNumber
          maxLength={6}
          placeholder={t('enter', { name: t('verificationCode') })}
          controls={false}
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
