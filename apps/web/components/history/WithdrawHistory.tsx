'use client'

import dayjs from 'dayjs'
import { FunctionComponent, useCallback, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getWithdrawOrder } from '@/services/wallet'
import { WithdrawOrderParams } from '@/services/wallet'
import { getStatus } from '../withdrawal/utils'
import Filter, { FilterParams } from './Filter'

const WithdrawHistory: FunctionComponent = () => {
  const { t } = useT('history')
  const [params, setParams] = useState<WithdrawOrderParams>({
    pageNo: 1,
    pageSize: 20,
    tokenId: '',
    beginTime: undefined,
    endTime: undefined,
  })
  const { data: orderList } = getWithdrawOrder(params)

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
            <TableHead className="text-[#666]">{t('history:address')}</TableHead>
            <TableHead className="text-[#666]">{t('history:time')}</TableHead>
            <TableHead className="text-[#666]">{t('history:status')}</TableHead>
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
                  <span className={cn('rounded px-2.5 py-1 text-[#222]', getStatus(order.status).color)}>
                    {t(`history:${getStatus(order.status).text}`)}
                  </span>
                </TableCell>
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
      <Pagination className="justify-end py-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}

export default WithdrawHistory
