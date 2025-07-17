'use client'

import { FunctionComponent } from 'react'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import DepositHistory from './DepositHistory'
import WithdrawHistory from './WithdrawHistory'

const History: FunctionComponent = () => {
  const { t } = useT('history')

  return (
    <div className="mt-6 rounded-[10px] bg-white p-6">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="h-8 bg-transparent p-0">
          <TabsTrigger
            value="deposit"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:deposit')}
          </TabsTrigger>
          <TabsTrigger
            value="withdraw"
            className="data-[state=active]:text-brand data-[state=active]:after:bg-brand relative cursor-pointer data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-2.5 data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[50px] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:content-['']"
          >
            {t('history:withdraw')}
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="deposit" className="mt-2">
          <DepositHistory />
        </TabsContent>
        <TabsContent value="withdraw" className="mt-2">
          <WithdrawHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default History
