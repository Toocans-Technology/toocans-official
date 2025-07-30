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
    <div className="mt-4 rounded-[10px] bg-white p-6">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="h-8 bg-transparent p-0">
          <TabsTrigger
            value="deposit"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer font-normal data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:deposit')}
          </TabsTrigger>
          <TabsTrigger
            value="withdraw"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer font-normal data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:withdraw')}
          </TabsTrigger>
          <TabsTrigger
            value="transferIn"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer font-normal data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:transferIn')}
          </TabsTrigger>
          <TabsTrigger
            value="transferOut"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer font-normal data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:transferOut')}
          </TabsTrigger>
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
