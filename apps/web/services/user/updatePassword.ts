import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UpdatePasswordParamsSchema = z.object({
  password: z.string().min(8).max(32),
  oldPassword: z.string().min(8).max(32),
})

export type UpdatePasswordParams = z.infer<typeof UpdatePasswordParamsSchema>

export const UpdatePasswordResponseSchema = z.nullable(z.boolean())

export type UpdatePasswordResponse = z.infer<typeof UpdatePasswordResponseSchema>

export const useUpdatePassword = () => {
  return useMutation(
    getMutation((params: UpdatePasswordParams) => {
      return {
        method: 'POST',
        url: getUrl('/user/updatePassword'),
        query: UpdatePasswordParamsSchema.parse(params),
        body: {},
        transfer: UpdatePasswordResponseSchema.parse,
      }
    })
  )
}
