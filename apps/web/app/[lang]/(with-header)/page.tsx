import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'home')

  return {
    title: t('home:title'),
    description: t('home:hero.description'),
  }
}

export default async function Page() {
  return <div className="flex min-h-svh items-center justify-center text-2xl">Home Page</div>
}
