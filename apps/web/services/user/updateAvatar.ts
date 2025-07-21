import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UpdateAvatarResponseSchema = z.nullable(z.boolean())

export type UpdateAvatarResponse = z.infer<typeof UpdateAvatarResponseSchema>

export const useUpdateAvatar = () => {
  return useMutation(
    getMutation((params: FormData) => ({
      method: 'POST',
      url: getUrl('/uc/user/updateAvatar'),
      body: params,
      transfer: UpdateAvatarResponseSchema.parse,
    }))
  )
}
