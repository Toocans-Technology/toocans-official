import Image from 'next/image'
import { Footer } from '@/components/layout'
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

export default async function Page({ params }: Props) {
  const { lang } = await params

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
            <button className={styles['deposit-btn']}>Deposit</button>
            <button className={styles['withdraw-btn']}>Withdraw</button>
          </div>
          </div>
        </div>
        <TokenTable lang={lang} />
      </div>
    </div>
  )
}
