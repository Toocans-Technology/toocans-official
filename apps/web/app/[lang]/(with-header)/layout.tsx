import { Header } from '@/components/layout'

interface Props {
  children: React.ReactNode
}

export default async function Layout({ children }: Readonly<Props>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
