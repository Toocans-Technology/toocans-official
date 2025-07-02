import { Header } from '@/components/layout'

interface Props {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}

export default async function Layout({ children, params }: Readonly<Props>) {
  const { lang } = await params

  return (
    <>
      <Header lang={lang} />
      {children}
    </>
  )
}
