'use client'

import { CircleX, Eye, EyeOff } from 'lucide-react'
import { FunctionComponent, useState, useRef, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Input,
  Button,
  Form,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getCountrys } from '@/services/login'
import { CheckComp, CountDownFetch } from './index'

const LoginBox: FunctionComponent = () => {
  const { t } = useT('login')

  const formData = useForm({
    defaultValues: {
      email: '',
      phone: '',
      nationalCode: '',
      password: '',
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

  const [loginType, setLoginType] = useState<string | 'email' | 'phone'>('email')
  const [codeType, setCodeType] = useState<string | 'pwd' | 'code'>('code')
  const [seconds, setSeconds] = useState(60)
  const [pwdVisible, changePwdVisible] = useState(false)
  const [cuntrysVisible, changeCuntrysVisible] = useState(false)
  const [phoneCheckState, changePhoneCheckState] = useState(false)

  const { data: countrys } = getCountrys()

  // console.log(countrys)
  const phoneValue = watch('phone')
  const emailValue = watch('email')
  const nationalCode = watch('nationalCode')
  const password = watch('password')

  const stateReset = () => {
    reset()
    changeCuntrysVisible(false)
    changePhoneCheckState(false)
  }

  const checkEmail = useCallback((val: string) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/.test(val)
  }, [])

  const checkPhone = useCallback((val: string) => {
    // TODO 区号 + 手机号校验
    return val?.length == 11
  }, [])

  const checkPassword = useCallback((val: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,32}$/.test(val)
  }, [])

  interface FormData {
    [key: string]: any
  }

  const onSubmit = async (data: FormData) => {
    if (loginType == 'email' && !checkEmail(data.email)) {
      setError('email', { type: 'custom', message: '1' })
      return
    }

    if (loginType == 'phone' && !checkPhone(data.phone)) {
      setError('phone', { type: 'custom', message: '1' })
      return
    }

    if (codeType == 'code' && nationalCode.length != 6) {
      setError('nationalCode', { type: 'custom', message: '1' })
      return
    }

    if (codeType == 'pwd' && checkPassword(data.password)) {
      setError('password', { type: 'custom', message: '1' })
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

  type valueType = 'email' | 'phone' | 'nationalCode' | 'password'

  const handleNumberChange = (e: any, type: valueType) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setValue(type, value, { shouldValidate: true })
  }

  const timerRef: any = useRef(null)
  const phoneInputRef: any = useRef(null)

  const handleGetCode = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (seconds == 0) clearInterval(timerRef.current)
    }
  }, [seconds])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!phoneInputRef?.current?.contains(event.target) && phoneCheckState && !checkPhone(phoneValue)) {
        setError('phone', { type: 'custom', message: '1' })
      }
    }

    phoneCheckState && document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [phoneCheckState])

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
                    stateReset()
                  }
                }}
              >
                {t(item)}
              </span>
            )
          })}
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
                        disabled={seconds < 60}
                        maxLength={50}
                        onFocus={() => setError('email', { type: 'custom', message: '' })}
                        type="email"
                        placeholder={t(`login:enter.email`)}
                        className="mt-2 bg-[#f8f8f8]"
                        aria-invalid={!!errors.email?.message}
                      />

                      {emailValue && seconds == 60 && (
                        <Button
                          type="button"
                          className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
                          variant="ghost"
                          onClick={() => setValue('email', '')}
                        >
                          <CircleX />
                        </Button>
                      )}
                    </div>
                    {errors.email?.message && (
                      <p className="text-destructive mt-2 text-[12px]">{t('formatErr.email')}</p>
                    )}
                  </>
                )}

                {/* phone input */}
                {loginType == 'phone' && (
                  <>
                    <div ref={phoneInputRef} className="relative">
                      <Input
                        {...register('phone', {
                          // onBlur: () => {
                          //   if (!checkPhone(phoneValue) && phoneCheckState) {
                          //     setError('phone', { type: 'custom', message: '1' })
                          //   }
                          // },
                        })}
                        aria-invalid={!!errors.phone?.message}
                        disabled={seconds < 60}
                        type="text"
                        onChange={(e) => handleNumberChange(e, 'phone')}
                        onFocus={() => {
                          setError('phone', { type: 'custom', message: '' })
                          changePhoneCheckState(true)
                        }}
                        maxLength={11}
                        placeholder={t(`login:enter.phone`)}
                        className="mt-2 bg-[#f8f8f8] pl-16"
                      />

                      <Popover>
                        <PopoverTrigger
                          onClick={() => changeCuntrysVisible(!cuntrysVisible)}
                          asChild
                          className="absolute left-3 top-1/2 flex h-5 -translate-y-1/2 cursor-pointer items-end gap-[2px] border-r-2 pr-1 text-xs text-[#666] hover:bg-transparent"
                        >
                          <div>
                            +{countrys?.[0]?.nationalCode}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              className={cn(cuntrysVisible && 'rotate-180', 'pointer-events-none')}
                              fill="none"
                            >
                              <path
                                opacity="0.6"
                                d="M9.33857 10.3092C8.94583 10.9282 8.04252 10.9282 7.64978 10.3092L5.66188 7.17585C5.23948 6.51007 5.71781 5.64014 6.50628 5.64014L10.4821 5.64014C11.2705 5.64014 11.7489 6.51007 11.3265 7.17585L9.33857 10.3092Z"
                                fill="#666666"
                              />
                            </svg>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-96" data-side="right" sideOffset={20}>
                          111
                        </PopoverContent>
                      </Popover>

                      {phoneValue && seconds == 60 && (
                        <Button
                          className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
                          type="button"
                          variant="ghost"
                          onClick={() => setValue('phone', '')}
                        >
                          <CircleX />
                        </Button>
                      )}
                    </div>
                    {errors.phone?.message && (
                      <p className="text-destructive mt-2 text-[12px]">{t('formatErr.phone')}</p>
                    )}
                  </>
                )}
              </div>

              {/* Verification Code input */}
              <span className={'select-none'}>{t(codeType == 'code' ? 'verificationCode' : 'password')}</span>
              {codeType == 'code' && (
                <>
                  <div className="relative">
                    <Input
                      {...register('nationalCode')}
                      maxLength={6}
                      type="text"
                      onChange={(e) => handleNumberChange(e, 'nationalCode')}
                      placeholder={t('login:enter.code')}
                      aria-invalid={!!errors.nationalCode?.message}
                      className="mt-2 bg-[#f8f8f8]"
                    />

                    {nationalCode && (
                      <Button
                        className={cn(
                          'absolute top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent',
                          checkEmail(emailValue) || checkPhone(phoneValue) ? 'right-10' : 'right-1'
                        )}
                        type="button"
                        variant="ghost"
                        onClick={() => setValue('nationalCode', '')}
                      >
                        <CircleX />
                      </Button>
                    )}

                    {(checkEmail(emailValue) || checkPhone(phoneValue)) && (
                      <Button
                        className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs text-[#3C7BF4] hover:bg-transparent hover:text-[#3C7BF4]"
                        variant="ghost"
                        type="button"
                        disabled={seconds < 60}
                        onClick={handleGetCode}
                      >
                        {seconds === 60 ? t('send') : seconds}
                      </Button>
                    )}
                    {seconds < 60 && <CountDownFetch {...formData} />}
                  </div>
                  {errors.nationalCode?.message && (
                    <p className="text-destructive mt-2 text-[12px]">{t('formatErr.code')}</p>
                  )}
                </>
              )}

              {/* password input */}
              {codeType == 'pwd' && (
                <>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      maxLength={32}
                      minLength={8}
                      type={pwdVisible ? 'text' : 'password'}
                      placeholder={t('login:enter.pwd')}
                      className="mt-2 bg-[#f8f8f8]"
                      aria-invalid={!!errors.password?.message}
                    />

                    {password && (
                      <Button
                        className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs hover:bg-transparent"
                        variant="ghost"
                        type="button"
                        onClick={() => changePwdVisible(!pwdVisible)}
                      >
                        {pwdVisible ? <EyeOff /> : <Eye />}
                      </Button>
                    )}
                  </div>
                  {errors.password?.message && (
                    <p className="text-destructive mt-2 text-[12px]">{t('formatErr.pwd')}</p>
                  )}
                </>
              )}

              <div className="mt-4 flex cursor-pointer select-none">
                {seconds == 60 ? (
                  <p
                    className="text-xs text-[#3C7BF4]"
                    onClick={() => setCodeType(codeType == 'code' ? 'pwd' : 'code')}
                  >
                    {t(codeType == 'code' ? 'switchToPwd' : 'switchToCode')}
                  </p>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-auto text-xs text-[#a9a9a9]">{t('notCode.tip1')}</span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="w-70 bg-white p-4"
                      style={{ boxShadow: '0px 9px 28px 8px rgba(0, 0, 0, 0.10)' }}
                    >
                      <p className="text-base text-black">{t('notCode.tip2')}</p>
                      <ul className="list-disc pl-4 text-sm text-[#666]">
                        <li>{t('notCode.step1')}</li>
                        <li>{t('notCode.step2')}</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <Button type="submit" className="mt-[36px] w-full rounded-[40px] text-base text-black">
                {t('login')}
              </Button>
            </form>
          </Form>
          <CheckComp {...formData} ref={checkBoxRef} />
        </div>
      </div>
    </div>
  )
}

export default LoginBox
