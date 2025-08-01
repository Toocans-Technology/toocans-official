'use client'

import dayjs from 'dayjs'
import { FunctionComponent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { getDepositOrder } from '@/services/wallet'
import { Empty } from '../../common'

const RecentDeposits: FunctionComponent = () => {
  const { t } = useT('deposit')
  const { data: orderList } = getDepositOrder({ pageNo: 1, pageSize: 10 })

  return (
    <div className="mt-4 rounded-[10px] bg-white p-6">
      <div className="border-b border-[#f4f4f4] pb-2.5">
        <div className="text-brand after:bg-brand relative inline-block h-7 text-base after:absolute after:-bottom-3 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:content-['']">
          {t('deposit:recentDeposits')}
        </div>
      </div>
      <Table className="mt-4">
        <TableHeader className="bg-[#f8f8f8]">
          <TableRow className="border-none">
            <TableHead className="text-[#666]">{t('deposit:token')}</TableHead>
            <TableHead className="text-[#666]">{t('deposit:amount')}</TableHead>
            <TableHead className="text-[#666]">{t('deposit:time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList?.length ? (
            orderList?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-3 font-medium">{order.tokenName}</TableCell>
                <TableCell className="text-brand py-3">{order.quantity}</TableCell>
                <TableCell className="py-3 text-right">
                  {dayjs(Number(order.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="py-8 text-center">
                <Empty />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentDeposits
