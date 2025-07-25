'use client'

import dayjs from 'dayjs'
import { CalendarIcon, XIcon } from 'lucide-react'
import { FunctionComponent, MouseEvent, useCallback, useMemo, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import {
  Calendar as CalendarComponent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Separator,
} from '@workspace/ui/components'
import { useT } from '@/i18n'

const format = 'YYYY-MM-DD'

interface CalendarProps {
  onConfirm?: (dateRange?: DateRange) => void
}

const Calendar: FunctionComponent<CalendarProps> = ({ onConfirm }) => {
  const { t } = useT('common')
  const [open, setOpen] = useState(false)
  const options = useMemo(
    () => [
      { label: t('common:7Days'), value: { from: dayjs().subtract(7, 'day').toDate(), to: dayjs().toDate() } },
      { label: t('common:30Days'), value: { from: dayjs().subtract(30, 'day').toDate(), to: dayjs().toDate() } },
      { label: t('common:90Days'), value: { from: dayjs().subtract(90, 'day').toDate(), to: dayjs().toDate() } },
    ],
    [t]
  )
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dayjs().subtract(30, 'day').toDate(),
    to: dayjs().toDate(),
  })

  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: dayjs().subtract(30, 'day').toDate(),
    to: dayjs().toDate(),
  })

  const handleConfirm = useCallback(() => {
    if (!dateRange) return

    setOpen(false)
    setSelectedDateRange(dateRange)
    onConfirm?.(dateRange)
  }, [dateRange])

  const clearDateRange = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    setSelectedDateRange(undefined)
    setDateRange(undefined)
    onConfirm?.(undefined)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button size="sm" variant="outline" className="border-input">
          <span className="text-[#666]">
            {selectedDateRange?.from && selectedDateRange?.to
              ? `${dayjs(selectedDateRange.from).format(format)} - ${dayjs(selectedDateRange.to).format(format)}`
              : `${t('common:startDate')} - ${t('common:endDate')}`}
          </span>
          {selectedDateRange?.from && selectedDateRange?.to ? (
            <span onClick={clearDateRange}>
              <XIcon className="size-3.5" color="#666" />
            </span>
          ) : (
            <CalendarIcon className="size-3.5" color="#666" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto overflow-hidden p-0" align="start">
        <div className="flex flex-col gap-2 p-2">
          {options.map((option) => (
            <Button
              key={option.label}
              size="sm"
              rounded="sm"
              className="w-full justify-start bg-[#f2f3f5] font-normal"
              onClick={() => setDateRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 flex-col border-l border-[#e5e6eb]">
          <CalendarComponent
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="flex-1"
          />
          <Separator className="bg-[#e5e6eb]" />
          <div className="flex justify-end p-2">
            <Button rounded="full" onClick={handleConfirm}>
              {t('common:confirm')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Calendar
