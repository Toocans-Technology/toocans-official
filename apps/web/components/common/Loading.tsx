import Image from 'next/image'
import { FunctionComponent } from 'react'
import { useT } from '@/i18n'

const Empty: FunctionComponent = () => {
  const { t } = useT('common')

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/images/loading.png" alt="loading" width={50} height={50} />
      <p className="text-center text-[#666] pt-4">{t('common:loading')}</p>
    </div>
  )
}

export default Empty
