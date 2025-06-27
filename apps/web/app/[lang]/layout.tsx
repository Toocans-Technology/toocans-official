import { Geist, Geist_Mono } from 'next/font/google'
import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { locales } from '@/i18n/config'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
