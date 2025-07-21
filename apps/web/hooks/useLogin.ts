import { isNil } from 'es-toolkit'
import { typedStorage } from '@/lib/utils'

export const useLogin = () => {
  const token = typedStorage.accessToken

  return { isLoggedIn: token !== '' && !isNil(token) }
}
