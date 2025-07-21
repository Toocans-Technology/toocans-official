import { History } from '@/components/history'
import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'history')

  return {
    title: t('history:title'),
    description: t('history:description'),
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'history')

  return (
    <div className="flex min-h-svh flex-col bg-[#f6f6f6]">
      <div className="container mx-auto max-w-[1000px] px-6 py-14">
        <h1 className="text-[32px] font-medium">{t('history:title')}</h1>
        <History />
      </div>
    </div>
  )
}
