import Image from 'next/image'
import { FunctionComponent } from 'react'
import { useT } from '@/i18n'

const Empty: FunctionComponent = () => {
  const { t } = useT('common')

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/images/empty.png" alt="empty" width={200} height={200} />
      <p className="text-center text-[#666]">{t('common:noData')}</p>
    </div>
  )
}

export default Empty
