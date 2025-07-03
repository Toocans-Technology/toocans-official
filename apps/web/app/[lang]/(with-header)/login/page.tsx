// 'use client'
import { Footer } from '@/components/layout'
import { LeftImg, LoginBox } from '@/components/login'

interface Props {
  params: Promise<{ lang: string }>
}

export default async function Login({ params }: Props) {
  const { lang } = await params

  return (
    <div className="min-w-305 flex overflow-x-scroll" style={{ height: 'calc(100vh - 76px)' }}>
      <LeftImg />
      <LoginBox />
    </div>
  )
}
