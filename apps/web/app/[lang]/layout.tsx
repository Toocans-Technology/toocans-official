import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { Geist, Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@workspace/ui/components'
import '@workspace/ui/globals.css'
import { WebVitals } from '@/app/_components'
import { BaseProviders, RouterProvider } from '@/components/providers'
import { locales } from '@/i18n/config'
import '@/styles/antd/globals.scss'
import themeConfig from '@/styles/themeConfig'
import Fix from '@/utils/fix'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export async function generateStaticParams() {
  if (process.env.generateStatic === 'true') {
    return locales.map((locale) => ({ lang: locale }))
  }

  return []
}

interface Props {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}

export default async function RootLayout({ children, params }: Readonly<Props>) {
  const { lang } = await params

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontInter.variable} font-inter antialiased`}>
        <AntdRegistry>
          <ConfigProvider theme={themeConfig}>
            <BaseProviders>
              <Toaster position="top-center" />
              <RouterProvider>
                {/* https://ant-design.antgroup.com/docs/react/v5-for-19-cn */}
                <Fix />
                <WebVitals />
                <NuqsAdapter>{children}</NuqsAdapter>
              </RouterProvider>
            </BaseProviders>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
