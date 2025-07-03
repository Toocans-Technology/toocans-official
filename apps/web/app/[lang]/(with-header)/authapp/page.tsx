'use client'

import Image from 'next/image'
import { Toaster, toast } from '@workspace/ui/components'
import React, { useState } from 'react'

export default function AuthAppPage() {
  const [emailCountdown, setEmailCountdown] = useState(0)
  const handleCopy = async () => {
    await navigator.clipboard.writeText('123123123123')
    toast.success('复制成功！')
  }
  const handleSendCode = () => {
    if (emailCountdown > 0) return
    toast.success('验证码已发送')
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
    <div className="bg-[#fafbfc] min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-xl max-w-[942px] w-full mx-auto shadow-[0_2px_16px_0_rgba(0,0,0,0.04)] p-[60px_32px_24px_32px]">
        <div className="text-black font-inter text-[32px] font-medium leading-[30px] pb-10">Authenticator app</div>
        <div className="mb-8">
          <div className="text-[#222] font-inter text-[16px] font-medium leading-[26px] pb-8">Set Up Two-Factor Authentication</div>
          <div className="flex items-center mb-2">
            <div className="flex w-5 h-5 p-2 justify-center items-center gap-2 text-white text-center rounded-full bg-[#222] font-inter text-[12px] font-medium leading-5">1</div>
            <div className="ml-2">Download authenticator</div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-5" />
            <div className="text-[#666] font-normal pl-5">Download Google Authenticator Android/iOS</div>
          </div>
          <div className="flex gap-12 mt-8 ml-6 mb-4">
            <div className="flex flex-col items-center text-[#666] text-center font-inter text-[14px] font-normal leading-[22px]">
              <Image src="/images/authapp/qr.png" alt="iOS" width={72} height={72} />
              <div>iOS</div>
            </div>
            <div className="flex flex-col items-center text-[#666] text-center font-inter text-[14px] font-normal leading-[22px]">
              <Image src="/images/authapp/qr.png" alt="Android" width={72} height={72} />
              <div>Android</div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="flex w-5 h-5 p-2 justify-center items-center gap-2 text-white text-center rounded-full bg-[#222] font-inter text-[12px] font-medium leading-5">2</div>
            <div className="ml-2">Scan QR code</div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-5" />
            <div className="text-[#666] font-normal pl-5">Open Google Authenticator, scan the QR code below or manually enter the key phrase to activate the verification token. Key phrase is used to recover Google Authenticator in the event of a loss or change of device — please make sure to keep the key phrase safe before setting up Google Authenticator。</div>
          </div>
          <div className="flex items-center gap-6 pl-6 mt-9">
            <Image src="/images/authapp/qr.png" alt="QR Code" width={72} height={72} />
            <div>
              <div className="text-[#666] font-inter text-[14px] font-normal leading-[22px] mb-1">Or manually enter the code below</div>
              <div className="flex items-center gap-2 w-fit text-[#222] font-inter text-[14px] font-medium leading-[22px]">
                123123123123
                <span className="cursor-pointer" onClick={handleCopy}>
                  <Image src="/images/authapp/iconoir_copy.svg" alt="iconoir_copy" width={24} height={24} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-5">
            <div className="flex w-5 h-5 p-2 justify-center items-center gap-2 text-white text-center rounded-full bg-[#222] font-inter text-[12px] font-medium leading-5">3</div>
            <div className="ml-2">Security authentication</div>
          </div>
          {verifyType === 'email' ? (
            <div className="mb-6 ml-8">
              <div className="text-[14px] text-[#222] font-medium mb-2">Email authentication</div>
              <div className="flex items-center gap-3">
                <input className="ml-8 flex w-[456px] h-11 px-3 items-center border-none text-black mb-7 bg-[#f5f5f5] rounded-md" placeholder="Enter 6-digit generated code from your app" />
                <button
                  className="bg-[#86fc70] text-[#222] rounded-[20px] px-5 h-9 text-[14px] font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendCode}
                  disabled={emailCountdown > 0}
                >
                  {emailCountdown > 0 ? `${emailCountdown}s` : 'Send'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 ml-8">
              <input className="ml-8 flex w-[456px] h-11 px-3 items-center border-none text-black mb-7 bg-[#f5f5f5] rounded-md" placeholder="Please enter the Authenticator code" />
            </div>
          )}
          <button className="ml-8 flex w-[456px] h-[44px] px-4 justify-center items-center rounded-[40px] bg-[#86fc70] text-[#222] text-[16px] font-normal leading-[22px] tracking-[-0.408px] cursor-pointer transition-colors active:bg-[#36c954]">Confirm</button>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}
