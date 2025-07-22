'use client'

import { useQueryState } from 'nuqs'
import { useLogin } from './useLogin'
import { useNoLocalePathname } from './useNoLocalePathname'
import { useRouter } from './useRouter'

const OVERVIEW_PATHNAME = '/overview'

export const useRedirectIfLogin = () => {
  const { isLoggedIn } = useLogin()
  const router = useRouter()
  const pathname = useNoLocalePathname()
  const [from] = useQueryState('from')
  const redirectPathname = from || OVERVIEW_PATHNAME

  if (isLoggedIn && pathname !== OVERVIEW_PATHNAME) {
    router.replace(redirectPathname)
  }

  return null
}
