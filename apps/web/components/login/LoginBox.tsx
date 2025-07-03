'use client'

import { CircleX } from 'lucide-react'
import { FunctionComponent, useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input, Button, Form } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { useCodeByEmail, a } from '@/services/login'
import { CheckComp, CountDown } from './index'

const LoginBox: FunctionComponent = () => {
  const formData = useForm({
    defaultValues: {
      email: '',
      phone: '',
      check1: true,
      check2: true,
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = formData

  const checkBoxRef: any = useRef(null)

  const [paramsEmail, setParamsEmail] = useState<a>()
  useCodeByEmail(paramsEmail)

  const [loginType, setLoginType] = useState<string | 'email' | 'phone'>('email')
  const [codeType, setCodeType] = useState<string | 'pwd' | 'code'>('code')

  const phoneValue = watch('phone')
  const emailValue = watch('email')

  const checkEmail = useCallback((val: string) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/.test(val)
  }, [])

  const checkPhone = useCallback((val: string) => {
    return val?.length == 11
  }, [])

  interface FormData {
    [key: string]: any
  }

  const onSubmit = async (data: FormData) => {
    console.log(1, data)
    setParamsEmail({ email: data.email })
    if (loginType == 'email' && !checkEmail(data.email)) {
      setError('email', { type: 'custom', message: '1' })
      return
    }

    if (loginType == 'phone' && !checkPhone(data.phone)) {
      setError('phone', { type: 'custom', message: '1' })
      return
    }

    if (!data.check1 && checkBoxRef.current) {
      checkBoxRef.current.openShak1()
      return
    }

    if (!data.check2 && checkBoxRef.current) {
      checkBoxRef.current.openShak2()
      return
    }

    // const res = await getCodyByEmail({ email: data.email })
    // console.log(res)
  }

  const handleNumberChange = (e: any, type: 'email' | 'phone') => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setValue(type, value, { shouldValidate: true })
  }

  const { t } = useT('login')

  return (
    <div className="flex flex-1 content-center bg-[#f1f1f1]">
      <div className="mt-35 ml-35">
        <p className="title text-2xl font-medium">
          {t('login:title')} {t('login:name')}
        </p>
        <div
          className="w-108 min-h-100 mt-4 rounded-2xl bg-white p-6"
          style={{ boxShadow: '10px 19px 250px 0px rgba(0, 0, 0, 0.22)' }}
        >
          {['email', 'phone'].map((item) => {
            return (
              <span
                className={cn(
                  'select-none',
                  'cursor-pointer',
                  loginType == item ? 'font-medium text-[#222]' : 'text-[#666]',
                  item == 'phone' && 'ml-4'
                )}
                key={item}
                onClick={() => {
                  if (loginType != item) {
                    setLoginType(item)
                    reset()
                  }
                }}
              >
                {t(item)}
              </span>
            )
          })}
          {/* onClick= */}
          <Form {...formData}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                {/* email input */}
                {loginType == 'email' && (
                  <>
                    <div className="relative">
                      <Input
                        {...register('email', {
                          onBlur: () => {
                            if (!checkEmail(emailValue)) {
                              setError('email', { type: 'custom', message: '1' })
                            }
                          },
                        })}
                        maxLength={50}
                        onFocus={() => setError('email', { type: 'custom', message: '' })}
                        type="email"
                        placeholder={t(`login:enter.email`)}
                        className={cn('mt-2', 'bg-[#f8f8f8]', errors.email?.message && 'border-destructive border-1')}
                      />

                      {emailValue && (
                        <Button
                          className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
                          variant="ghost"
                          onClick={() => setValue('email', '')}
                        >
                          <CircleX />
                        </Button>
                      )}
                    </div>
                    {errors.email?.message && <p className="mt-2 text-[12px] text-[#FD305D]">{t('formatErr.email')}</p>}
                  </>
                )}

                {/* phone input */}
                {loginType == 'phone' && (
                  <>
                    <div className="relative">
                      <Input
                        {...register('phone', {
                          onBlur: () => {
                            if (!checkPhone(phoneValue)) {
                              setError('phone', { type: 'custom', message: '1' })
                            }
                          },
                        })}
                        type="text"
                        onChange={(e) => handleNumberChange(e, 'phone')}
                        onFocus={() => setError('phone', { type: 'custom', message: '' })}
                        maxLength={11}
                        placeholder={t(`login:enter.phone`)}
                        className={cn('mt-2', 'bg-[#f8f8f8]', errors.phone?.message && 'border-destructive border-1')}
                      />

                      {phoneValue && (
                        <Button
                          className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
                          variant="ghost"
                          onClick={() => setValue('phone', '')}
                        >
                          <CircleX />
                        </Button>
                      )}
                    </div>
                    {errors.phone?.message && <p className="mt-2 text-[12px] text-[#FD305D]">{t('formatErr.phone')}</p>}
                  </>
                )}
              </div>
              <span className={'select-none'}>{t(codeType == 'code' ? 'verificationCode' : 'password')}</span>
              <div className="relative">
                <Input type="text" placeholder={t(`login:enter.${codeType}`)} className="mb-4 mt-2 bg-[#f8f8f8]" />

                {codeType == 'code' && (checkEmail(emailValue) || checkPhone(phoneValue)) && <CountDown />}
              </div>
              <p
                className="cursor-pointer select-none text-xs text-[#3C7BF4]"
                onClick={() => setCodeType(codeType == 'code' ? 'pwd' : 'code')}
              >
                {t(codeType == 'code' ? 'switchToPwd' : 'switchToCode')}
              </p>
              <Button type="submit" className="mt-[36px] w-full rounded-[40px] text-base text-black">
                {t('login')}
              </Button>
            </form>
          </Form>
          <CheckComp register={register} setValue={setValue} watch={watch} ref={checkBoxRef} />
        </div>
      </div>
    </div>
  )
}

export default LoginBox
