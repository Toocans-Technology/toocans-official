'use client'

import { EyeFilled, EyeInvisibleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import { throttle } from 'es-toolkit'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback, useState } from 'react'
import { useT } from '@/i18n'
import { useSetPassword } from '@/services/login'
import { matchPassword, PasswordErrorType } from '@/utils'
import { openToast } from '@/utils'
import { useForgetContext } from '../ForgetContext'

const ChangePassword = () => {
  const { t } = useT('login')
  const router = useRouter()
  const { formData, userToken, grantType } = useForgetContext()

  const [isDisabled, setIsDisabled] = useState(true)
  const { mutateAsync: handleSetPassword } = useSetPassword()

  const password = Form.useWatch('password', formData)
  const confirmPassword = Form.useWatch('confirmPassword', formData)
  const [errType, setErrType] = useState<PasswordErrorType | null>(null)

  const onSubmit = useCallback(
    throttle(async () => {
      try {
        await handleSetPassword({ password: formData.getFieldValue('password'), userToken })
        openToast(t('login:successfully', { name: t('login:set') }))
        router.replace('/login')
      } catch (error) {
        openToast((error as Error).message, 'error')
      }
    }, 1000),
    [grantType]
  )

  useEffect(() => {
    setIsDisabled(matchPassword(password) != true || confirmPassword != password || !password || !confirmPassword)
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
                setErrType(matchResult?.errorType)
                return Promise.reject()
              }
            },
          },
        ]}
      >
        <Input.Password
          maxLength={32}
          minLength={8}
          placeholder={t('login:enter', { name: t('login:password') })}
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
          onBlur={() => {
            const confirmPassword = formData.getFieldValue('confirmPassword')
            if (confirmPassword && confirmPassword !== formData.getFieldValue('password')) {
              formData.setFields([
                {
                  name: ['confirmPassword'],
                  errors: [t('login:inconsistent', { name: t('login:password') })],
                },
              ])
            }
          }}
          allowClear
          iconRender={(visible: boolean) => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
        />
      </Form.Item>
      <div className="text-[#666] [&>p]:mt-2 [&_.anticon-close-circle]:mr-2">
        <p className={errType == PasswordErrorType.lowercase ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('login:ruleTip.lowercase')}
        </p>
        <p className={errType == PasswordErrorType.uppercase ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('login:ruleTip.uppercase')}
        </p>
        <p className={errType == PasswordErrorType.number ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('login:ruleTip.number')}
        </p>
        <p className={errType == PasswordErrorType.length ? 'text-destructive' : ''}>
          <CloseCircleFilled />
          {t('login:ruleTip.length')}
        </p>
      </div>

      <p className={'mt-4 select-none'}>{t('login:confirmPassword')}</p>

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
                return Promise.reject(t('login:inconsistent', { name: t('login:password') }))
              }
            },
          },
        ]}
      >
        <Input.Password
          maxLength={32}
          allowClear
          minLength={8}
          placeholder={t('login:enter', { name: t('login:password') })}
          onFocus={() => {
            if (formData.getFieldError('confirmPassword')?.length) {
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

      <Button disabled={isDisabled} className="mt-6 w-full" type="primary" onClick={onSubmit}>
        {t('login:next')}
      </Button>
    </>
  )
}

export default ChangePassword
