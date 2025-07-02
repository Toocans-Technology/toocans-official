import OverviewBalancePanel from '@/components/overview/OverviewBalancePanel'
import TokenTable from '@/components/overview/TokenTable'
import styles from './overview.module.scss'

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params
  return (
    <div className={styles['overview-container']}>
      <div className={styles['overview-content']}>
        <h1 className={styles['overview-title']}>Asset Overview</h1>
        <OverviewBalancePanel />
        <TokenTable lang={lang} />
      </div>
    </div>
  )
}
