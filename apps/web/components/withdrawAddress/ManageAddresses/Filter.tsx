'use client'

import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react'
import { Input, SelectToken } from '@/components/common'
import { useT } from '@/i18n'

export interface FilterParams {
  tokenId: string
  keyword?: string
}

interface FilterProps {
  onChange?: (params: FilterParams) => void
}

const Filter: FunctionComponent<FilterProps> = ({ onChange }) => {
  const { t } = useT('withdrawAddress:searchPlaceholder')
  const [filterParams, setFilterParams] = useState<FilterParams>({
    tokenId: '',
    keyword: '',
  })

  const handleTokenChange = useCallback(
    (value: string) => {
      setFilterParams((prev) => ({ ...prev, tokenId: value === 'all' ? '' : value }))
      onChange?.({ ...filterParams, tokenId: value === 'all' ? '' : value })
    },
    [filterParams, onChange]
  )

  const handleKeywordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFilterParams((prev) => ({ ...prev, keyword: e.target.value }))
      onChange?.({ ...filterParams, keyword: e.target.value })
    },
    [filterParams, onChange]
  )

  return (
    <div className="flex items-center gap-10">
      <SelectToken onSelect={handleTokenChange} />
      <Input
        name="keyword"
        className="border-1 border-[#D3D2D2] bg-white focus-within:border-[#D3D2D2] focus-within:ring-0 hover:border-[#D3D2D2] hover:ring-0"
        inputClassName="rounded-md h-8 bg-white"
        placeholder={t('withdrawAddress:searchPlaceholder')}
        onChange={handleKeywordChange}
        startContent={<Image src="/icons/search.svg" alt="search" width={20} height={20} />}
      />
    </div>
  )
}

export default Filter
