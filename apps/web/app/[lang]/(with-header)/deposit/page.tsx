import { DepositSteps } from '@/components/deposit'
import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'deposit')

  return {
    title: t('deposit:title'),
    description: t('deposit:description'),
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'deposit')

  return (
    <div className="flex min-h-svh flex-col bg-[#f6f6f6]">
      <div className="container mx-auto max-w-[1000px] px-6 py-14">
        <h1 className="text-[32px] font-medium">{t('deposit:title')}</h1>
        <DepositSteps />
      </div>
    </div>
  )
}
