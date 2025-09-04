'use client'

import Image from 'next/image'
import { FunctionComponent } from 'react'
import { useT } from '@/i18n'

const EmptyAddress: FunctionComponent = () => {
  const { t } = useT('withdrawal')

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Image src="/icons/address.svg" alt="empty-address" width={92} height={93} />
      <p className="text-center text-sm text-[#666]">{t('withdrawal:selectAddressModal.empty')}</p>
    </div>
  )
}

export default EmptyAddress
