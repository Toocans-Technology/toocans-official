import { Form, Button, Input } from 'antd'
import Link from '@/components/common/Link'
import { GrantType, LoginType } from '@/components/login/data'
import { EmailReg } from '@/data'
import { useRouter } from '@/hooks'
import { useT } from '@/i18n'
import { useForgetContext } from '../ForgetContext'
import PhoneInput from './PhoneInput'

const InputComp = () => {
  const { t } = useT('login')
  const router = useRouter()

  const { grantType, formData, step, setStep } = useForgetContext()

  const handleNext = async () => {
    await formData.validateFields()
    if (step == 0) setStep(1)
  }

  return (
    <>
      {grantType == GrantType.EMAIL && (
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
      )}

      {grantType == GrantType.SMS && <PhoneInput />}

      <Link href="/login?LoginType=password" replace className="cursor-pointer text-xs text-[#3C7BF4]">
        {t('switchTo', { type: LoginType.PASSWORD })}
      </Link>

      <Button type="primary" onClick={handleNext} className="mt-[36px] w-full" style={{ fontWeight: 500 }}>
        {t('next')}
      </Button>
    </>
  )
}
export default InputComp
