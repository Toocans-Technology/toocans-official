'use client'

import { useEffect, useState } from 'react'
import { useLogin } from './useLogin'
import { useNoLocalePathname } from './useNoLocalePathname'
import { useRouter } from './useRouter'

const LOGIN_PATHNAME = '/login'

export const useRedirectIfNotLogin = () => {
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isLoggedIn && pathname !== LOGIN_PATHNAME) {
    router.replace(LOGIN_PATHNAME, {
      query: {
        from: pathname,
      },
    })
  }

  return null
}
