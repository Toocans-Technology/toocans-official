'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import React, { useState, useCallback } from 'react'
import { z } from 'zod'
import { toast } from '@workspace/ui/components'
import { useT } from '@/i18n'
// import { useBindEmail } from '@/services/user/bindEmail'
// import { useBindPhone } from '@/services/user/bindPhone'
// import { useBindVerificationCode } from '@/services/user/bindVerificationCode'
import { useGenerateGoogleAuth } from '@/services/user/generateGoogleAuth'
import { useUserInfo } from '@/services/user/info'
// import { useSendBindCode } from '@/services/user/sendBindCode'
// import { useSendCodeByUserPhoneOrEmail } from '@/services/user/sendCodeByUserPhoneOrEmail'
// import { useUnbindGoogleAuth } from '@/services/user/unbindGoogleAuth'
import { useVerifyGoogleAuth } from '@/services/user/verifyGoogleAuth'

export default function AuthAppPage() {
  const { t } = useT('authapp')
  const { data: userInfoRes } = useUserInfo()
  const [hasToast, setHasToast] = useState(false)
  React.useEffect(() => {
    if (userInfoRes && userInfoRes.hasGaKey && !hasToast) {
      toast.error('已绑定谷歌验证器，请勿重复绑定');
      setHasToast(true);
      // setTimeout(() => {
      //   window.history.back();
      // }, 2000);
    }
  }, [userInfoRes, hasToast])
  
  const { mutateAsync: mutateVerifyGoogleAuth } = useVerifyGoogleAuth()

  const [emailCountdown, setEmailCountdown] = useState(0)
  const [googleCode, setGoogleCode] = useState('')
  const handleSendCode = () => {
    if (emailCountdown > 0) return
    toast.success(t('authapp:VerificationCodeSent'))
    setEmailCountdown(60)
    const timer = setInterval(() => {
      setEmailCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  const verifyType = 'google'

  const FormSchema = z.object({
    code: z.string(),
    secretKey: z.string(),
  })

  // // 1. 绑定邮箱
  // const { data: bindEmailRes, isLoading: bindEmailLoading, error: bindEmailError } = useBindEmail({
  //   email: 'test@bdy.tech',
  //   verificationCode: '123456',
  //   validEmail: true,
  // })
  // // 2. 绑定手机
  // const { data: bindPhoneRes, isLoading: bindPhoneLoading, error: bindPhoneError } = useBindPhone({
  //   nationalCode: '86',
  //   phoneNumber: '13800138000',
  //   verificationCode: '654321',
  //   fullPhoneNumber: '8613800138000',
  //   validPhoneNumber: true,
  // })
  // // 3. 校验验证码
  // const { data: bindVerificationCodeRes, isLoading: bindVerificationCodeLoading, error: bindVerificationCodeError } = useBindVerificationCode({
  //   code: '123456',
  //   googleCode: '654321',
  //   idCard: '123456789012345678',
  // })
  // 4 sendBindCode
  // const { data: sendBindCodeRes } = useSendBindCode({
  //   countryCode: '86',
  //   phone: '13800138000',
  //   email: 'test@bdy.tech',
  // })
  // 5 sendCodeByUserPhoneOrEmail
  // const { data: sendCodeByUserPhoneOrEmailRes } = useSendCodeByUserPhoneOrEmail()
  // 6 unbindGoogleAuth
  // const { data: unbindGoogleAuthRes } = useUnbindGoogleAuth({
  //   code: '497017',
  // })
  // 8 generateGoogleAuth
  const { data: generateGoogleAuthRes } = useGenerateGoogleAuth()
  const handleCopySecretKey = async () => {
    if (generateGoogleAuthRes?.secretKey) {
      await navigator.clipboard.writeText(generateGoogleAuthRes.secretKey)
      toast.success(t('authapp:CopySuccess') || 'Copied!')
    }
  }

  const handleWithdraw = useCallback(
    //这里服务端返回成功也会报错
    async (data: z.infer<typeof FormSchema>) => {
      console.log('data', data)
      await mutateVerifyGoogleAuth({
        code: googleCode ?? '',
        secretKey: generateGoogleAuthRes?.secretKey ?? '',
      })
    },
    [mutateVerifyGoogleAuth, googleCode, generateGoogleAuthRes]
  )
  const handleVerifyGoogleAuth = () => {
    if (!googleCode || !generateGoogleAuthRes?.secretKey) {
      toast.error('Please enter the code and make sure secretKey exists')
      return
    }
    handleWithdraw({
      code: googleCode,
      secretKey: generateGoogleAuthRes.secretKey,
    })
  }
  React.useEffect(() => {
    // if (bindEmailRes) {
    //   console.log('bindEmailRes:', bindEmailRes)
    // }
    // if (bindPhoneRes) {
    //   console.log('bindPhoneRes:', bindPhoneRes)
    // }
    // if (bindVerificationCodeRes) {
    //   console.log('bindVerificationCodeRes:', bindVerificationCodeRes)
    // }
    // if (sendBindCodeRes) {
    //   console.log('1:', sendBindCodeRes)
    // }
    // if (sendCodeByUserPhoneOrEmailRes) {
    //   console.log('2:', sendCodeByUserPhoneOrEmailRes)
    // }
    // if (unbindGoogleAuthRes) {
    //   console.log('3:', unbindGoogleAuthRes)
    // }
    if (generateGoogleAuthRes) {
      console.log('5:', generateGoogleAuthRes)
    }
    // }, [bindEmailRes, bindPhoneRes, bindVerificationCodeRes, sendBindCodeRes, sendCodeByUserPhoneOrEmailRes, unbindGoogleAuthRes, verifyGoogleAuthRes])
  }, [generateGoogleAuthRes])
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafbfc]">
      <div className="mx-auto w-full max-w-[942px] rounded-xl bg-white p-[60px_32px_24px_32px] shadow-[0_2px_16px_0_rgba(0,0,0,0.04)]">
        <div className="font-inter pb-10 text-[32px] font-medium leading-[30px] text-black">Authenticator app</div>
        <div className="mb-8">
          <div className="font-inter pb-8 text-[16px] font-medium leading-[26px] text-[#222]">
            Set Up Two-Factor Authentication
          </div>
          <div className="mb-2 flex items-center">
            <div className="font-inter flex h-5 w-5 items-center justify-center gap-2 rounded-full bg-[#222] p-2 text-center text-[12px] font-medium leading-5 text-white">
              1
            </div>
            <div className="ml-2">Download authenticator</div>
          </div>
          <div className="mb-2 flex items-center">
            <div className="w-5" />
            <div className="pl-5 font-normal text-[#666]">Download Google Authenticator Android/iOS</div>
          </div>
          <div className="mb-4 ml-6 mt-8 flex gap-12">
            <div className="font-inter flex flex-col items-center text-center text-[14px] font-normal leading-[22px] text-[#666]">
              <Image src="/images/authapp/qr.png" alt="iOS" width={72} height={72} />
              <div>iOS</div>
            </div>
            <div className="font-inter flex flex-col items-center text-center text-[14px] font-normal leading-[22px] text-[#666]">
              <Image src="/images/authapp/Googlepay.png" alt="Android" width={72} height={72} />
              <div>Android</div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-2 flex items-center">
            <div className="font-inter flex h-5 w-5 items-center justify-center gap-2 rounded-full bg-[#222] p-2 text-center text-[12px] font-medium leading-5 text-white">
              2
            </div>
            <div className="ml-2">Scan QR code</div>
          </div>
          <div className="mb-2 flex items-center">
            <div className="w-5" />
            <div className="pl-5 font-normal text-[#666]">
              Open Google Authenticator, scan the QR code below or manually enter the key phrase to activate the
              verification token. Key phrase is used to recover Google Authenticator in the event of a loss or change of
              device — please make sure to keep the key phrase safe before setting up Google Authenticator。
            </div>
          </div>
          <div className="mt-9 flex items-center gap-6 pl-6">
            {generateGoogleAuthRes?.qrCodeUrl ? (
              <QRCodeSVG value={generateGoogleAuthRes.qrCodeUrl} size={72} />
            ) : (
              <Image src="/images/authapp/qr.png" alt="QR Code" width={72} height={72} />
            )}
            <div>
              <div className="font-inter mb-1 text-[14px] font-normal leading-[22px] text-[#666]">
                Or manually enter the code below
              </div>
              <div className="font-inter flex w-fit items-center gap-2 text-[14px] font-medium leading-[22px] text-[#222]">
                {generateGoogleAuthRes?.secretKey || '--'}
                <span className="cursor-pointer" onClick={handleCopySecretKey}>
                  <Image src="/images/authapp/iconoir_copy.svg" alt="iconoir_copy" width={24} height={24} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-5 flex items-center">
            <div className="font-inter flex h-5 w-5 items-center justify-center gap-2 rounded-full bg-[#222] p-2 text-center text-[12px] font-medium leading-5 text-white">
              3
            </div>
            <div className="ml-2">Security authentication</div>
          </div>
          {verifyType === 'email' ? (
            <div className="mb-6 ml-8">
              <div className="mb-2 text-[14px] font-medium text-[#222]">Email authentication</div>
              <div className="flex items-center gap-3">
                <input
                  className="mb-7 ml-8 flex h-11 w-[456px] items-center rounded-md border-none bg-[#f5f5f5] px-3 text-black"
                  placeholder="Enter 6-digit generated code from your app"
                />
                <button
                  className="h-9 cursor-pointer rounded-[20px] bg-[#86fc70] px-5 text-[14px] font-medium text-[#222] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSendCode}
                  disabled={emailCountdown > 0}
                >
                  {emailCountdown > 0 ? `${emailCountdown}s` : 'Send'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 ml-8">
              <input
                className="mb-7 ml-8 flex h-11 w-[456px] items-center rounded-md border-none bg-[#f5f5f5] px-3 text-black"
                placeholder="Please enter the Authenticator code"
                value={googleCode}
                onChange={(e) => setGoogleCode(e.target.value)}
              />
            </div>
          )}
          <button
            className="ml-8 flex h-[44px] w-[456px] cursor-pointer items-center justify-center rounded-[40px] bg-[#86fc70] px-4 text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[#222] transition-colors active:bg-[#36c954]"
            onClick={handleVerifyGoogleAuth}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
