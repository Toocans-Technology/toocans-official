import { Geist, Inter } from 'next/font/google'
import '@workspace/ui/globals.css'
import { BaseProviders, RouterProvider } from '@/components/providers'
import { locales } from '@/i18n/config'

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
        <BaseProviders>
          <RouterProvider>{children}</RouterProvider>
        </BaseProviders>
      </body>
    </html>
  )
}
