'use client'

import dayjs from 'dayjs'
import { FunctionComponent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { getDepositOrder } from '@/services/wallet'

const DepositHistory: FunctionComponent = () => {
  const { t } = useT('history')
  const { data: orderList } = getDepositOrder({ pageNo: 1, pageSize: 20 })

  return (
    <Table className="mt-4">
      <TableHeader className="bg-[#f8f8f8]">
        <TableRow className="border-none">
          <TableHead className="text-[#666]">{t('history:token')}</TableHead>
          <TableHead className="text-[#666]">{t('history:amount')}</TableHead>
          <TableHead className="text-[#666]">{t('history:time')}</TableHead>
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
              {t('history:noData')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default DepositHistory
