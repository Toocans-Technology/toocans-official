import Image from 'next/image'
import { FunctionComponent } from 'react'

const LeftImg: FunctionComponent = () => {
  return (
    <div className="w-12/25 flex items-center justify-center bg-[#151515]">
      <Image src={'/images/login/bg.png'} alt="" width={558} height={489} />
    </div>
  )
}

export default LeftImg
