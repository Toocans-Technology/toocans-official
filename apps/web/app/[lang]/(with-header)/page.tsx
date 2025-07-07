import { Button, ConfigProvider, DatePicker, version } from 'antd'
import { AssetsAndMarkets, HeroSection, Markets, SafeAndTrust, SignUpNow } from '@/components/home'
import { Footer } from '@/components/layout'
import { getT } from '@/i18n/server'
import customTheme from '@/styles/themeData'

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

export default async function Page({ params }: Props) {
  const { lang } = await params

  return (
    <ConfigProvider theme={customTheme}>
      <div className="flex min-h-svh flex-col bg-black text-white">
        <HeroSection lang={lang} />
        <Markets />
        <SafeAndTrust lang={lang} />
        <AssetsAndMarkets lang={lang} />
        <SignUpNow lang={lang} />
        <Footer lang={lang} />
      </div>
    </ConfigProvider>
  )
}
