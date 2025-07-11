'use client'

import { EyeFilled, EyeInvisibleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useT } from '@/i18n'
import { useSetPassword } from '@/services/login'
import { matchPassword, PasswordErrorType } from '@/utils'
import { openToast } from '@/utils'
import { useForgetContext } from '../ForgetContext'

const ChangePassword = () => {
  const { t } = useT('login')
  const router = useRouter()
  const { formData } = useForgetContext()

  const [isDisabled, setIsDisabled] = useState(true)
  const { mutateAsync: handleSetPassword } = useSetPassword()

  const password = Form.useWatch('password', formData)
  const confirmPassword = Form.useWatch('confirmPassword', formData)
  const [errType, setErrType] = useState<PasswordErrorType | null>(null)

  const submitNewPws = async () => {
    try {
      await handleSetPassword({ password })
      openToast(t('successfully', { name: t('set') }))
      router.replace('/')
    } catch (error) {
      openToast((error as Error).message, 'error')
    }
  }

  useEffect(() => {
    setIsDisabled(!(matchPassword(password) && confirmPassword === password && !!password))
  }, [password, confirmPassword])

  return (
    <>
      <p className={'select-none'}>{t('password')}</p>

      <Form.Item
        name="password"
        validateTrigger="onBlur"
        style={{ marginTop: '8px' }}
        rules={[
          {
            required: true,
            message: '',
          },
          {
            validator: (_rule, value) => {
              const matchResult = matchPassword(value)
              if (matchResult === true) {
                return Promise.resolve()
              } else {
                setErrType(matchResult?.errotype)
                return Promise.reject()
              }
            },
          },
        ]}
      >
        <Input.Password
          maxLength={32}
          minLength={8}
          placeholder={t('enter', { name: 'password' })}
          autoComplete="off"
          onFocus={() => {
            formData.setFields([
              {
                name: ['password'],
                errors: [],
              },
            ])
            setErrType(null)
          }}
          allowClear
          iconRender={(visible: boolean) => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
        />
      </Form.Item>
      <div className="text-[#666] [&>p]:mt-2 [&_.anticon-close-circle]:mr-2">
        <p className={errType == PasswordErrorType.lowercase ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('ruleTip.lowercase')}
        </p>
        <p className={errType == PasswordErrorType.uppercase ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('ruleTip.uppercase')}
        </p>
        <p className={errType == PasswordErrorType.number ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('ruleTip.number')}
        </p>
        <p className={errType == PasswordErrorType.length ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('ruleTip.length')}
        </p>
      </div>

      <p className={'mt-4 select-none'}>{t('confirmPassword')}</p>

      <Form.Item
        name="confirmPassword"
        validateTrigger="onBlur"
        style={{ marginTop: '8px' }}
        rules={[
          {
            required: true,
            message: '',
          },
          {
            validator: (_rule, value) => {
              if (value === formData.getFieldValue('password')) {
                return Promise.resolve()
              } else {
                return Promise.reject(t('inconsistent', { name: t('password') }))
              }
            },
          },
        ]}
      >
        <Input.Password
          maxLength={32}
          allowClear
          minLength={8}
          placeholder={t('enter', { name: 'password' })}
          onFocus={() => {
            if (formData.getFieldError('confirmPassword')) {
              formData.setFields([
                {
                  name: ['confirmPassword'],
                  errors: [],
                },
              ])
            }
          }}
          autoComplete="off"
          iconRender={(visible: boolean) => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
        />
      </Form.Item>

      <Button disabled={isDisabled} className="mt-6 w-full" type="primary" onClick={submitNewPws}>
        {t('next')}
      </Button>
    </>
  )
}

export default ChangePassword
