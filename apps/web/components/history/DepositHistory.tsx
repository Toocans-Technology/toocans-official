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
import { useT } from '@/i18n'
import { getDepositOrder } from '@/services/wallet'
import { DepositOrderParams } from '@/services/wallet'
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
  const { data: orderList } = getDepositOrder(params)

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
          {orderList?.length ? (
            orderList?.map((order) => (
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

export default DepositHistory
