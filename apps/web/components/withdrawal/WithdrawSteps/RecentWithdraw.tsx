'use client'

import dayjs from 'dayjs'
import { FunctionComponent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { getWithdrawOrder } from '@/services/wallet'

interface Props {
  tokenId: string
}

const RecentWithdraw: FunctionComponent<Props> = ({ tokenId }) => {
  const { t } = useT('withdrawal')
  const { data: orderList } = getWithdrawOrder({ pageNo: 1, pageSize: 10, tokenId })

  return (
    <div className="mt-6 rounded-[10px] bg-white p-6">
      <div className="border-b border-[#f4f4f4] pb-2.5">
        <div className="text-brand after:bg-brand relative inline-block h-7 text-base after:absolute after:-bottom-3 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:content-['']">
          {t('withdrawal:recentWithdraws')}
        </div>
      </div>
      <Table className="mt-4">
        <TableHeader className="bg-[#f8f8f8]">
          <TableRow className="border-none">
            <TableHead className="text-[#666]">{t('deposit:token')}</TableHead>
            <TableHead className="text-[#666]">{t('deposit:amount')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:address')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:time')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawal:status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList?.length ? (
            orderList?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-[#222]">{order.tokenName}</TableCell>
                <TableCell className="text-brand">{order.arriveQuantity}</TableCell>
                <TableCell className="text-right text-[#222]">{order.address}</TableCell>
                <TableCell className="text-right text-[#222]">
                  {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell className="text-right text-[#222]">{order.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-8 text-center">
                {t('deposit:noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentWithdraw
