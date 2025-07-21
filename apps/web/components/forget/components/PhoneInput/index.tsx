'use client'

import { Form, Input, Button } from 'antd'
import { useRef, useEffect } from 'react'
import '@workspace/ui/components'
import { useT } from '@/i18n'
import { matchPhoneNum } from '@/utils'
import { useForgetContext } from '../../ForgetContext'
import CountryList from './CountryList'

const PhoneInput = () => {
  const { t } = useT('login')
  const { formData } = useForgetContext()

  const phoneInputRef: any = useRef(null)

  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  return (
    <div className="relative" ref={phoneInputRef}>
      <CountryList />

      <Form.Item
        name="phone"
        style={{ marginTop: '8px' }}
        className="relative"
        rules={[
          { required: true, message: '' },
          {
            validator: (rule, value) => {
              if (!matchPhoneNum(nationalCode, value)) {
                return Promise.reject(t('formatErr', { name: `${t('phone')} ${t('number')}` }))
              }
              return Promise.resolve()
            },
          },
        ]}
        validateTrigger="onBlur"
      >
        <Input
          style={{ paddingLeft: '64px' }}
          allowClear
          maxLength={11}
          placeholder={t('enter', { name: t('phone') })}
          onFocus={() => {
            if (formData.getFieldError('phone')) {
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
