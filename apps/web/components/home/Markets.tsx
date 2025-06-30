'use client'

import Image from 'next/image'
import { FunctionComponent } from 'react'

const Markets: FunctionComponent = () => {
  return (
    <div className="w-full bg-[#0f0f0f]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-16 text-white">
        <Image src="/images/home/markets.png" alt="Markets" width={1200} height={540} />
      </div>
    </div>
  )
}

export default Markets
