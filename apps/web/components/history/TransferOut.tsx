'use client'

import dayjs from 'dayjs'
import { FunctionComponent, useCallback, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { getRecordList, RecordParams } from '@/services/user'
import { BusinessType } from '@/types/user'
import { PaginationControls } from '../common'
import Filter, { FilterParams } from './Filter'

const pageSize = 20

const TransferOut: FunctionComponent = () => {
  const { t } = useT('history')
  const [params, setParams] = useState<RecordParams>({
    pageNo: 1,
    pageSize,
    tokenId: '',
    businessType: BusinessType.transfer,
    beginTime: dayjs().subtract(30, 'day').toDate().getTime(),
    endTime: dayjs().toDate().getTime(),
  })
  const { data: recordData } = getRecordList(params)

  const handleChange = useCallback((filterParams: FilterParams) => {
    setParams({ ...filterParams, businessType: BusinessType.transfer, pageNo: 1, pageSize })
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordData?.list?.length ? (
            recordData.list.map((record) => (
              <TableRow key={record.id} className="border-none">
                <TableCell className="p-3 font-medium text-[#222]">{record.tokenName}</TableCell>
                <TableCell className="text-destructive p-3">-{record.amount}</TableCell>
                <TableCell className="p-3">{record.accountId}</TableCell>
                <TableCell className="p-3">{dayjs(Number(record.createDate)).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
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

export default TransferOut
