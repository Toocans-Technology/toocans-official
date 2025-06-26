'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@workspace/ui/components'
import { useT } from '@/i18n'

const NotFound = () => {
  const { t } = useT('404')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Image
        src={'/images/404.svg'}
        alt="404"
        width={500}
        height={500}
        style={{ width: '100%', maxWidth: '500px', maxHeight: '500px' }}
      />
      <h1 className="text-2xl font-bold">{t('404:title')}</h1>
      <h4 className="text-lg">{t('404:description')}</h4>
      <Link href="/" className="mt-4">
        <Button color="primary">{t('404:goToHome')}</Button>
      </Link>
    </div>
  )
}

export default NotFound
