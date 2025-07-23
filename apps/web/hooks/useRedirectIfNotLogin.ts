'use client'

import { useEffect, useState } from 'react'
import { PATHNAMES } from '@/lib/utils/pathnames'
import { useLogin } from './useLogin'
import { useNoLocalePathname } from './useNoLocalePathname'
import { useRouter } from './useRouter'

export const useRedirectIfNotLogin = () => {
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isLoggedIn && pathname !== PATHNAMES.login) {
    router.replace(PATHNAMES.login, {
      query: {
        from: pathname,
      },
    })
  }

  return null
}
