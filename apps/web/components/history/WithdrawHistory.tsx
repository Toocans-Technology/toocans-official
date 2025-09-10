'use client'

import dayjs from 'dayjs'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { Empty, PaginationControls } from '@/components/common'
import { useT } from '@/i18n'
import { getRecordList, RecordParams } from '@/services/user'
import { BusinessType } from '@/types/user'
import { WithdrawDetailModal } from '../withdrawal/modals'
import Filter, { FilterParams } from './Filter'

const pageSize = 20

const WithdrawHistory: FunctionComponent = () => {
  const { t } = useT('history')
  const [open, setOpen] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [params, setParams] = useState<RecordParams>({
    pageNo: 1,
    pageSize,
    tokenId: '',
    businessType: BusinessType.withdraw,
    beginTime: dayjs().subtract(30, 'day').toDate().getTime(),
    endTime: dayjs().toDate().getTime(),
  })
  const { data: recordData, isLoading } = getRecordList(params)

  const handleOpenDetail = useCallback((id: string) => {
    setOpen(true)
    setOrderId(id)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
    setOrderId('')
  }, [])

  const handleChange = useCallback((filterParams: FilterParams) => {
    setParams({ ...filterParams, businessType: BusinessType.withdraw, pageNo: 1, pageSize })
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
            <TableHead className="text-[#666]">{t('withdrawal:action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordData?.list?.length ? (
            recordData.list.map((record) => (
              <TableRow key={record.id} className="border-none">
                <TableCell className="p-3 font-medium text-[#222]">{record.tokenName}</TableCell>
                <TableCell className="text-destructive p-3">-{record.amount}</TableCell>
                <TableCell className="p-3">{dayjs(Number(record.createDate)).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell className="p-3">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(record.businessId)}>
                    <Image src="/icons/list.svg" alt="list" width={20} height={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-8 text-center">
                {isLoading ? (
                  <div className="flex w-full justify-center">
                    <Loader2Icon className="animate-spin" color="#86FC70" />
                  </div>
                ) : (
                  <Empty />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {recordData?.pages ? (
        <PaginationControls
          className="py-2"
          totalPages={recordData?.pages}
          currentPage={Number(recordData?.pageNum) || 0}
          onPageChange={(page: number) => params && setParams({ ...params, pageNo: page })}
        />
      ) : null}
      <WithdrawDetailModal id={orderId} open={open} onOpenChange={handleOpenChange} isDetail={true} />
    </>
  )
}

export default WithdrawHistory
