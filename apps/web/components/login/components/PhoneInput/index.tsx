'use client'

import { Form, Input } from 'antd'
import { useRef, useEffect } from 'react'
import '@workspace/ui/components'
import { useT } from '@/i18n'
import { useLoginContext } from '../../LoginContext'
import { matchPhoneNum } from '../../utils'
import CountryList from './CountryList'

const PhoneInput = () => {
  const { t } = useT('login')
  const { formData, phoneCheckState, setPhoneCheckState } = useLoginContext()

  const phoneInputRef: any = useRef(null)

  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!phoneInputRef?.current?.contains(event.target) && phoneCheckState && !matchPhoneNum(nationalCode, phone)) {
        formData.setFields([{ name: 'phone', value: phone, errors: [t('formatErr.phone')] }])
      }
    }

    phoneCheckState && document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [phoneCheckState, phone])

  return (
    <div className="relative" ref={phoneInputRef}>
      <CountryList />

      <Form.Item name="phone" style={{ marginTop: '8px' }} className="relative">
        <Input
          style={{ paddingLeft: '64px' }}
          allowClear
          maxLength={11}
          placeholder={t('login:enter.phone')}
          onFocus={() => {
            setPhoneCheckState(true)
            if (formData.getFieldError('phone')) {
              formData.setFieldValue('phone', formData.getFieldValue('phone'))
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
