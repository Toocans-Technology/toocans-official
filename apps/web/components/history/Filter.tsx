'use client'

import dayjs from 'dayjs'
import { FunctionComponent, useCallback, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Label } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Calendar, SelectToken } from '../common'

export interface FilterParams {
  tokenId: string
  beginTime?: number
  endTime?: number
}

interface FilterProps {
  onChange?: (params: FilterParams) => void
}

const Filter: FunctionComponent<FilterProps> = ({ onChange }) => {
  const { t } = useT('history')
  const [filterParams, setFilterParams] = useState<FilterParams>({
    tokenId: '',
    beginTime: undefined,
    endTime: undefined,
  })

  const handleTokenChange = useCallback(
    (value: string) => {
      setFilterParams((prev) => ({ ...prev, tokenId: value === 'all' ? '' : value }))
      onChange?.({ ...filterParams, tokenId: value === 'all' ? '' : value })
    },
    [filterParams]
  )

  const handleDateRangeChange = useCallback(
    (dateRange?: DateRange) => {
      const params = {
        beginTime: dateRange?.from?.getTime() || undefined,
        endTime: dateRange?.to?.getTime() || undefined,
      }
      setFilterParams((prev) => ({ ...prev, ...params }))
      onChange?.({ ...filterParams, ...params })
    },
    [filterParams]
  )

  return (
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-[#666]">{t('history:token')}</Label>
        <SelectToken onSelect={handleTokenChange} />
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm text-[#666]">{t('history:date')}</Label>
        <Calendar onConfirm={handleDateRangeChange} />
      </div>
    </div>
  )
}

export default Filter
