'use client'

import Image from 'next/image'
import { Toaster, toast } from '@workspace/ui/components'
import React, { useState } from 'react'
import styles from './authapp.module.scss'

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
    <div className={styles['authapp-container']}>
      <div className={styles['authapp-box']}>
        <div className={styles['authapp-title']}>Authenticator app</div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-title']}>Set Up Two-Factor Authentication</div>
          <div className={styles['authapp-step-desc']}>
            <div className={styles['num']}>1</div>
            <div>Download authenticator</div>
          </div>
          <div className={styles['authapp-step-desc']}>
            <div></div>
            <div style={{ color: '#666', fontWeight: '400', paddingLeft: '20px' }}>
              Download Google Authenticator Android/iOS
            </div>
          </div>
          <div className={styles['authapp-qrs']}>
            <div className={styles['authapp-qr']}>
              <Image src="/images/authapp/qr.png" alt="iOS" width={72} height={72} />
              <div>iOS</div>
            </div>
            <div className={styles['authapp-qr']}>
              <Image src="/images/authapp/qr.png" alt="Android" width={72} height={72} />
              <div>Android</div>
            </div>
          </div>
        </div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-desc']}>
            <div className={styles['num']}>2</div>
            <div>Scan QR code</div>
          </div>
          <div className={styles['authapp-step-desc']}>
            <div></div>
            <div style={{ color: '#666', fontWeight: '400', paddingLeft: '20px' }}>
              Open Google Authenticator, scan the QR code below or manually enter the key phrase to activate the
              verification token. Key phrase is used to recover Google Authenticator in the event of a loss or change of
              device — please make sure to keep the key phrase safe before setting up Google Authenticator。
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingLeft: '25px', marginTop: '36px' }}>
            <Image src="/images/authapp/qr.png" alt="QR Code" width={72} height={72} />
            <div>
              <div className={styles['authapp-tip']}>Or manually enter the code below</div>
              <div className={styles['authapp-manual']}>
                123123123123
                <span style={{ cursor: 'pointer' }} onClick={handleCopy}>
                  <Image src="/images/authapp/iconoir_copy.svg" alt="iconoir_copy" width={24} height={24} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-desc']} style={{ marginBottom: '19px' }}>
            <div className={styles['num']}>3</div>
            <div>Security authentication</div>
          </div>
          {verifyType === 'email' ? (
            <div className={styles['authapp-verify-area']}>
              <div className={styles['authapp-label']}>Email authentication</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input className={styles['authapp-input']} placeholder="Enter 6-digit generated code from your app" />
                <button
                  className={styles['authapp-send-btn']}
                  onClick={handleSendCode}
                  disabled={emailCountdown > 0}
                  style={emailCountdown > 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {emailCountdown > 0 ? `${emailCountdown}s` : 'Send'}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles['authapp-verify-area']}>
              <input className={styles['authapp-input']} placeholder="Please enter the Authenticator code" />
            </div>
          )}
          <button className={styles['authapp-btn']}>Confirm</button>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}
