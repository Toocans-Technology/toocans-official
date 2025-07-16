'use client'

import { useContext } from 'react'
import { RouterContext } from '@/components/providers'

export const useRouter = () => {
  const router = useContext(RouterContext)
  return router
}
