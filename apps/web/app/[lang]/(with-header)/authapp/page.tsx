'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import React, { useState, useCallback } from 'react'
import { Input } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { GOOGLE_CODE_REGEXP } from '@/lib/regexp'
import { useGenerateGoogleAuth } from '@/services/user/generateGoogleAuth'
import { useUserInfo } from '@/services/user/info'
import { useVerifyGoogleAuth } from '@/services/user/verifyGoogleAuth'
import { HttpError } from '@/types/http'
import { openToast } from '@/utils'

export default function AuthAppPage() {
  const { t } = useT('authapp')
  const { data: userInfoRes } = useUserInfo()
  const { mutateAsync: mutateVerifyGoogleAuth, isPending } = useVerifyGoogleAuth()
  const [googleCode, setGoogleCode] = useState('')
  const [bindSuccess, setBindSuccess] = useState(true)
  React.useEffect(() => {
    if (userInfoRes && userInfoRes.hasGaKey) {
      setGoogleCode('')
      setBindSuccess(true)
      openToast(t('authapp:AlreadyBinded'), 'error')
      setTimeout(() => {
        window.history.back()
      }, 2000)
    } else {
      if (userInfoRes && !userInfoRes.hasGaKey) {
        setBindSuccess(false)
      }
    }
  }, [userInfoRes])
  const { data: generateGoogleAuthRes } = useGenerateGoogleAuth()
  const handleCopySecretKey = async () => {
    if (generateGoogleAuthRes?.secretKey) {
      await navigator.clipboard.writeText(generateGoogleAuthRes.secretKey)
      openToast(t('authapp:CopySuccess'))
    }
  }

  const handleVerifyGoogleAuthSubmit = useCallback(async () => {
    try {
      await mutateVerifyGoogleAuth({
        code: googleCode ?? '',
        secretKey: generateGoogleAuthRes?.secretKey ?? '',
      })
      openToast(t('authapp:VerificationSuccess'))
      setGoogleCode('')
      setBindSuccess(true)
      setTimeout(() => {
        window.history.back()
      }, 2000)
    } catch (error) {
      setBindSuccess(false)
      openToast((error as HttpError).message, 'error')
    }
  }, [mutateVerifyGoogleAuth, googleCode, generateGoogleAuthRes, t])

  const handleVerifyGoogleAuth = () => {
    if (!googleCode || !generateGoogleAuthRes?.secretKey) {
      openToast(t('authapp:PleaseEnterCodeAndSecretKey'), 'error')
      return
    }
    if (!GOOGLE_CODE_REGEXP.test(googleCode)) {
      openToast(t('authapp:GoogleCode6Digits'), 'error')
      return
    }
    handleVerifyGoogleAuthSubmit()
  }

  React.useEffect(() => {
    if (generateGoogleAuthRes) {
      console.log('5:', generateGoogleAuthRes)
    }
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
          <div className="mb-6">
            {!bindSuccess && (
              <Input
                maxLength={6}
                className="mb-7 ml-7 flex h-11 w-[456px] items-center rounded-md border-none bg-[#f5f5f5] px-3 text-black"
                placeholder="Please enter the Authenticator code"
                value={googleCode}
                onChange={(e) => setGoogleCode(e.target.value)}
              />
            )}
          </div>
          {!bindSuccess && (
            <button
              disabled={isPending}
              className="ml-8 flex h-[44px] w-[456px] cursor-pointer items-center justify-center rounded-[40px] bg-[#86fc70] px-4 text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[#222] transition-colors active:bg-[#36c954]"
              onClick={handleVerifyGoogleAuth}
            >
              {t('authapp:Confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
