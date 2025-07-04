'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Toaster, toast } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useUserInfo } from '@/services/user/info'

export default function AuthAppPage() {
  const { t } = useT('authapp')
  const { data: userInfoRes } = useUserInfo();
  if (userInfoRes) {
    console.log('hasGaKey:', userInfoRes.hasGaKey)
  }
  const [emailCountdown, setEmailCountdown] = useState(0)
  const handleCopy = async () => {
    await navigator.clipboard.writeText('123123123123')
    toast.success(t('authapp:title'))
  }
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
  const verifyType = 'email'

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
              <Image src="/images/authapp/qr.png" alt="Android" width={72} height={72} />
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
            <Image src="/images/authapp/qr.png" alt="QR Code" width={72} height={72} />
            <div>
              <div className="font-inter mb-1 text-[14px] font-normal leading-[22px] text-[#666]">
                Or manually enter the code below
              </div>
              <div className="font-inter flex w-fit items-center gap-2 text-[14px] font-medium leading-[22px] text-[#222]">
                123123123123
                <span className="cursor-pointer" onClick={handleCopy}>
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
              />
            </div>
          )}
          <button className="ml-8 flex h-[44px] w-[456px] cursor-pointer items-center justify-center rounded-[40px] bg-[#86fc70] px-4 text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-[#222] transition-colors active:bg-[#36c954]">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
