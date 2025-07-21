'use client'

import { useQueryState } from 'nuqs'
import { useLogin } from './useLogin'
import { useNoLocalePathname } from './useNoLocalePathname'
import { useRouter } from './useRouter'

export const useRedirectIfLogin = () => {
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()
  const [from] = useQueryState('from')
  const redirectPathname = from || '/'

  if (isLoggedIn && pathname !== '/') {
    router.replace(redirectPathname)
  }

  return null
}
