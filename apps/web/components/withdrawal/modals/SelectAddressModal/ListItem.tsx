'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import { FunctionComponent, useCallback } from 'react'
import { useT } from '@/i18n'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'

interface Props {
  data: WithdrawAddress
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const ListItem: FunctionComponent<Props> = ({ data, isSelected, onSelect }) => {
  const { t } = useT(['withdrawal'])

  const handleSelect = useCallback(() => {
    onSelect?.(data.id)
  }, [onSelect, data.id])

  return (
    <div
      className="border-border flex flex-1 cursor-pointer items-center justify-between border-b"
      onClick={handleSelect}
    >
      <div className="flex flex-1 flex-col gap-2 pb-4">
        {data.addressName && <div className="font-medium">{data.addressName}</div>}
        {data.tokenId && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sm font-medium">{data.tokenId}</span>
            {data.chainName && <span className="rounded bg-[#f8f8f8] px-1.5">{data.chainName}</span>}
          </div>
        )}
        <div className="text-xs text-[#666]">{data.address}</div>
        <div className="flex items-center gap-2 text-xs text-[#666]">
          {`${t('withdrawal:selectAddressModal.addedOn')} ${dayjs(Number(data.created)).format('YYYY-MM-DD HH:mm')}`}
        </div>
      </div>
      {isSelected && <Image src="/icons/checked.svg" alt="checked" width={24} height={24} />}
    </div>
  )
}

export default ListItem
