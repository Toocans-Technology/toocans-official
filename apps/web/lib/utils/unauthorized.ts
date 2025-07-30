import { getRouter } from '@/components/providers'
import { getQueryClient } from '@/lib/utils/queryClient'
import { PATHNAMES } from './pathnames'
import typedStorage from './typedStorage'

export const cleanUpAfterLogout = () => {
  const router = getRouter()
  const queryClient = getQueryClient()
  queryClient.clear()
  typedStorage.clearToken()
  router.replace(PATHNAMES.login)
}
