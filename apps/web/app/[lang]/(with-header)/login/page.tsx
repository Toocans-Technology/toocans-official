// 'use client'
import { LeftImg, LoginBox } from '@/components/login'

export default async function Login() {
  return (
    <div className="min-w-305 flex overflow-x-scroll" style={{ height: 'calc(100vh - 76px)' }}>
      <LeftImg />
      <LoginBox />
    </div>
  )
}
