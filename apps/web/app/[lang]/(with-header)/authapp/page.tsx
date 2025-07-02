import Image from 'next/image'
import styles from './page.module.scss'

export default function AuthAppPage() {
  return (
    <div className={styles['authapp-container']}>
      <div className={styles['authapp-box']}>
        <div className={styles['authapp-title']}>Authenticator app</div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-title']}>1 Download authenticator</div>
          <div className={styles['authapp-step-desc']}>Download Google Authenticator Android/iOS</div>
          <div className={styles['authapp-qrs']}>
            <div className={styles['authapp-qr']}>
              <Image src="/images/overview/qr-ios.png" alt="iOS" width={80} height={80} />
              <div>iOS</div>
            </div>
            <div className={styles['authapp-qr']}>
              <Image src="/images/overview/qr-android.png" alt="Android" width={80} height={80} />
              <div>Android</div>
            </div>
          </div>
        </div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-title']}>2 Scan QR code</div>
          <div className={styles['authapp-step-desc']}>
            Open Google Authenticator, scan the QR code below or manually enter the key phrase to activate the
            verification token. Key phrase is used to recover Google Authenticator in the event of a loss or change of
            device — please make sure to keep the key phrase safe before setting up Google Authenticator。
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image src="/images/overview/qr-auth.png" alt="QR Code" width={80} height={80} />
            <div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Or manually enter the code below</div>
              <div className={styles['authapp-manual']}>
                123123123123
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 17H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="10"
                    y="10"
                    width="10"
                    height="10"
                    rx="2"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['authapp-step']}>
          <div className={styles['authapp-step-title']}>3 Security authentication</div>
          <input className={styles['authapp-input']} placeholder="Please enter the Authenticator code" />
          <button className={styles['authapp-btn']}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
