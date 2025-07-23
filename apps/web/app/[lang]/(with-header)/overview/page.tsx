'use client'

import OverviewBalancePanel from '@/components/overview/OverviewBalancePanel'
import TokenTable from '@/components/overview/TokenTable'
import { useT } from '@/i18n'

export default function Page() {
  const { t } = useT('overview')
  return (
    <div className="flex min-h-screen justify-center bg-[#f6f6f6]">
      <div className="w-full max-w-[942px] px-8 pt-[60px]">
        <h1 className="font-inter text-[32px] font-medium leading-[30px] text-black mb-[16px]">
          {t('overview:AssetOverview')}
        </h1>
        <OverviewBalancePanel />
        <TokenTable />
      </div>
    </div>
  )
}
