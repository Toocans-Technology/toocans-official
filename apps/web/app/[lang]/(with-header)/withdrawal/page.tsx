import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'withdrawal')

  return {
    title: t('withdrawal:title'),
    description: t('withdrawal:description'),
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'withdrawal')

  return (
    <div className="flex min-h-svh flex-col bg-[#f6f6f6]">
      <div className="container mx-auto max-w-[1000px] px-6 py-14">
        <h1 className="text-[32px] font-medium">{t('withdrawal:title')}</h1>
      </div>
    </div>
  )
}
