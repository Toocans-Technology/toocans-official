import ForgetBox from '@/components/forget/ForgetBox'
import { LeftImg } from '@/components/login/components'

export default async function Login() {
  return (
    <div className="min-w-305 flex overflow-x-scroll" style={{ height: 'calc(100vh - 76px)' }}>
      <LeftImg />
      <ForgetBox />
    </div>
  )
}
