'use client'

import dayjs from 'dayjs'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { Empty, PaginationControls } from '@/components/common'
import { useT } from '@/i18n'
import { getRecordList, RecordParams } from '@/services/user'
import { BusinessType } from '@/types/user'
import Filter, { FilterParams } from './Filter'

const pageSize = 20

const WithdrawHistory: FunctionComponent = () => {
  const { t } = useT('history')
  const [params, setParams] = useState<RecordParams>({
    pageNo: 1,
    pageSize,
    tokenId: '',
    businessType: BusinessType.withdraw,
    beginTime: dayjs().subtract(30, 'day').toDate().getTime(),
    endTime: dayjs().toDate().getTime(),
  })
  const { data: recordData, isLoading } = getRecordList(params)

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
            <TableHead className="text-right text-[#666]">{t('history:time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordData?.list?.length ? (
            recordData.list.map((record) => (
              <TableRow key={record.id} className="border-none">
                <TableCell className="p-3 font-medium text-[#222]">{record.tokenName}</TableCell>
                <TableCell className="text-destructive p-3">-{record.amount}</TableCell>
                <TableCell className="p-3 text-right">
                  {dayjs(Number(record.createDate)).format('YYYY-MM-DD HH:mm:ss')}
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
    </>
  )
}

export default WithdrawHistory
