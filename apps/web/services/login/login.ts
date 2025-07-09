import { useMutation } from '@tanstack/react-query'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const useLogin = () => {
  return useMutation(
    getMutation((params) => ({
      method: 'POST',
      url: getUrl('/auth/login'),
      body: params as any,
      transfer: (data) => {
        return data
      },
    }))
  )
}
