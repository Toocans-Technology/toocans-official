'use client'

import dayjs from 'dayjs'
import { FunctionComponent, useCallback, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { getDepositOrderList } from '@/services/wallet'
import { DepositOrderParams } from '@/services/wallet'
import { PaginationControls } from '../common'
import Filter, { FilterParams } from './Filter'

const DepositHistory: FunctionComponent = () => {
  const { t } = useT('history')
  const [params, setParams] = useState<DepositOrderParams>({
    pageNo: 1,
    pageSize: 20,
    tokenId: '',
    beginTime: undefined,
    endTime: undefined,
  })
  const { data: orderData } = getDepositOrderList(params)

  const handleChange = useCallback((filterParams: FilterParams) => {
    setParams({ ...filterParams, pageNo: 1, pageSize: 20 })
  }, [])

  return (
    <>
      <Filter onChange={handleChange} />
      <Table className="mt-4">
        <TableHeader className="bg-[#f8f8f8]">
          <TableRow className="border-none">
            <TableHead className="text-[#666]">{t('history:token')}</TableHead>
            <TableHead className="text-[#666]">{t('history:amount')}</TableHead>
            <TableHead className="text-[#666]">{t('history:time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderData?.list.length ? (
            orderData.list?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-3 font-medium">{order.tokenName}</TableCell>
                <TableCell className="text-brand py-3">
                  {Number(order.quantity) >= 0 ? `+${order.quantity}` : `-${order.quantity}`}
                </TableCell>
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
      {orderData?.pages ? (
        <PaginationControls
          className="py-2"
          totalPages={orderData?.pages}
          currentPage={Number(orderData?.pageNum) || 0}
          onPageChange={(page: number) => params && setParams({ ...params, pageNo: page })}
        />
      ) : null}
    </>
  )
}

export default DepositHistory
