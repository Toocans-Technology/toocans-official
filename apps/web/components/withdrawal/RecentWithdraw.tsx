'use client'

import dayjs from 'dayjs'
import { FunctionComponent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getWithdrawOrder } from '@/services/wallet'
import { Empty } from '../common'
import { getWithdrawalStatus } from './utils'

const RecentWithdraw: FunctionComponent = () => {
  const { t } = useT('withdrawal')
  const { data: orderList } = getWithdrawOrder({ pageNo: 1, pageSize: 10 })

  return (
    <div className="mt-4 rounded-[10px] bg-white p-6">
      <div className="border-border border-b pb-2.5">
        <div className="text-brand after:bg-brand relative inline-block h-7 text-base after:absolute after:-bottom-3 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:content-['']">
          {t('withdrawal:recentWithdrawal')}
        </div>
      </div>
      <Table className="mt-4">
        <TableHeader className="bg-[#f8f8f8]">
          <TableRow className="border-none">
            <TableHead className="text-[#666]">{t('withdrawal:token')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:amount')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:address')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:time')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList?.length ? (
            orderList?.map((order) => (
              <TableRow key={order.id} className="border-none">
                <TableCell className="p-3 font-medium text-[#222]">{order.tokenName}</TableCell>
                <TableCell className="text-destructive p-3">-{order.totalQuantity}</TableCell>
                <TableCell className="p-3">{order.address}</TableCell>
                <TableCell className="p-3">{dayjs(Number(order.createdAt)).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell className="p-3">
                  <span className={cn('rounded-full px-2.5 py-1 text-[#222]', getWithdrawalStatus(order.status).color)}>
                    {t(`withdrawal:${getWithdrawalStatus(order.status).text}`)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-8 text-center">
                <Empty />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentWithdraw
