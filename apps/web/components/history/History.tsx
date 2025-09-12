'use client'

import { FunctionComponent } from 'react'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { useRedirectIfNotLogin } from '@/hooks/useRedirectIfNotLogin'
import { useT } from '@/i18n'
import DepositHistory from './DepositHistory'
import TransferIn from './TransferIn'
import TransferOut from './TransferOut'
import WithdrawHistory from './WithdrawHistory'

const History: FunctionComponent = () => {
  const { t } = useT('history')

  useRedirectIfNotLogin()

  return (
    <div className="mt-3 rounded-[10px] bg-white p-6">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="-mx-2 h-8 bg-transparent p-0">
          <TabsTrigger value="deposit">{t('history:deposit')}</TabsTrigger>
          <TabsTrigger value="withdraw">{t('history:withdraw')}</TabsTrigger>
          <TabsTrigger value="transferIn">{t('history:transferIn')}</TabsTrigger>
          <TabsTrigger value="transferOut">{t('history:transferOut')}</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="deposit" className="mt-2">
          <DepositHistory />
        </TabsContent>
        <TabsContent value="withdraw" className="mt-2">
          <WithdrawHistory />
        </TabsContent>
        <TabsContent value="transferIn" className="mt-2">
          <TransferIn />
        </TabsContent>
        <TabsContent value="transferOut" className="mt-2">
          <TransferOut />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default History
