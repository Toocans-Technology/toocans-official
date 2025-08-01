'use client'

import { useQueryState } from 'nuqs'
import { PATHNAMES } from '@/lib/utils'
import { useLogin } from './useLogin'
import { useNoLocalePathname } from './useNoLocalePathname'
import { useRouter } from './useRouter'

export const useRedirectIfLogin = () => {
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()
  const [from] = useQueryState('from')
  const redirectPathname = from || PATHNAMES.overview

  if (isLoggedIn && pathname !== PATHNAMES.overview) {
    router.replace(redirectPathname)
  }

  return null
}
