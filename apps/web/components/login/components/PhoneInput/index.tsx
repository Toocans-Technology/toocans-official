'use client'

import { Form, Input } from 'antd'
import { useT } from '@/i18n'
import { matchPhoneNum } from '@/utils'
import { useLoginContext } from '../../LoginContext'
import CountryList from './CountryList'

const PhoneInput = () => {
  const { t } = useT('login')
  const { formData, seconds, cuntrysVisible } = useLoginContext()

  const nationalCode = Form.useWatch('nationalCode', formData)

  return (
    <div className="relative">
      <CountryList />
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: '' },
          {
            validator: (_rule, value) => {
              if (!matchPhoneNum(nationalCode, value)) {
                return Promise.reject(new Error(t('formatErr', { name: `${t('phone')}` })))
              } else {
                return Promise.resolve()
              }
            },
          },
        ]}
        validateTrigger="onBlur"
        style={{ marginTop: '8px' }}
        validateDebounce={300}
        validateStatus={!cuntrysVisible && formData.getFieldError('phone')?.length ? 'error' : undefined}
      >
        <Input
          style={{ paddingLeft: '64px', borderColor: cuntrysVisible ? '#1aca75' : undefined }}
          allowClear
          disabled={seconds < 60}
          maxLength={11}
          placeholder={t('enter', { name: t('phone') })}
          onFocus={() => {
            if (formData.getFieldError('phone')?.length) {
              formData.setFields([
                {
                  name: ['phone'],
                  errors: [],
                },
              ])
            }
          }}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, '')
            formData.setFieldValue('phone', value)
          }}
        />
      </Form.Item>
    </div>
  )
}

export default PhoneInput
