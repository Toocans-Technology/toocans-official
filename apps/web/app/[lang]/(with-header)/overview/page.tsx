import Image from 'next/image'
import TokenTable from '@/components/overview/TokenTable'
import { getT } from '@/i18n/server'
import styles from './overview.module.scss'
interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'home')

  return {
    title: t('home:title'),
    description: t('home:hero.description'),
  }
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params

  return (
    <div className={styles['overview-container']}>
      <div className={styles['overview-content']}>
        <h1 className={styles['overview-title']}>Asset Overview</h1>
        <div className={styles['overview-balance']}>
          <div className={styles['overview-balance-label']}>
            Total Balance
            <Image src="/images/overview/Action_Eye_Open.svg" alt="Assets" width={20} height={20} />
          </div>
          <div style={{ width: '100%',display: 'flex', flexDirection: 'row',justifyContent: 'space-between' }}>
            <div className={styles['overview-balance-panel']}>
              <div className={styles['overview-balance-value']}>742,851.00</div>
              <div className={styles['overview-balance-usdt']}>USDT ≈ $742,851.00</div>
            </div>
            <div className={styles['overview-balance-actions']}>
              <a href="/deposit" className={styles['deposit-btn']}>Deposit</a>
              <a href="/withdraw" className={styles['withdraw-btn']}>Withdraw</a>
            </div>
          </div>
        </div>
        <TokenTable lang={lang} />
      </div>
    </div>
  )
}
