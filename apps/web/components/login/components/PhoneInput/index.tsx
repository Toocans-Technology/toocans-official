'use client'

import { Form, Input } from 'antd'
import { useRef, useEffect } from 'react'
import '@workspace/ui/components'
import { useT } from '@/i18n'
import { matchPhoneNum } from '@/utils'
import { useLoginContext } from '../../LoginContext'
import CountryList from './CountryList'

const PhoneInput = () => {
  const { t } = useT('login')
  const { formData, phoneCheckState, setPhoneCheckState, seconds } = useLoginContext()

  const phoneInputRef: any = useRef(null)

  const phone = Form.useWatch('phone', formData)
  const nationalCode = Form.useWatch('nationalCode', formData)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!phoneInputRef?.current?.contains(event.target) && phoneCheckState && !matchPhoneNum(nationalCode, phone)) {
        formData.setFields([{ name: 'phone', errors: [t('formatErr', { name: `${t('phone')} ${t('number')}` })] }])
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
          disabled={seconds < 60}
          maxLength={11}
          placeholder={t('enter', { name: t('phone') })}
          onFocus={() => {
            setPhoneCheckState(true)
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
