import { Suspense } from 'react'
import LoginBox from '@/components/login/LoginBox'
import { LeftImg } from '@/components/login/components'
import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'login')

  return {
    title: t('login:title'),
    description: t('login:description'),
  }
}

export default async function Page() {
  return (
    <div className="min-w-305 flex overflow-x-scroll" style={{ height: 'calc(100vh - 76px)' }}>
      <LeftImg />
      <Suspense>
        <LoginBox />
      </Suspense>
    </div>
  )
}
