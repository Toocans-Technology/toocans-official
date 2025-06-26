'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@workspace/ui/components'

const NotFound = () => (
  <div className="flex min-h-svh flex-col items-center justify-center">
    <Image
      src={'/images/404.svg'}
      alt="404"
      width={500}
      height={500}
      style={{ width: '100%', maxWidth: '500px', maxHeight: '500px' }}
    />
    <h1 className="text-2xl font-bold">Ops!!!</h1>
    <h4 className="text-lg">This page you are looking for could not be found.</h4>
    <Link href="/" className="mt-4">
      <Button color="primary">Go Back to Home</Button>
    </Link>
  </div>
)

export default NotFound
