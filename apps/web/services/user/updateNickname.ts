import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UpdateNicknameParamsSchema = z.object({
  nickname: z.string().min(5).max(20),
})

export type UpdateNicknameParams = z.infer<typeof UpdateNicknameParamsSchema>

export const UpdateNicknameResponseSchema = z.nullable(z.boolean())

export type UpdateNicknameResponse = z.infer<typeof UpdateNicknameResponseSchema>

export const useUpdateNickname = () => {
  return useMutation(
    getMutation((params: UpdateNicknameParams) => {
      return {
        method: 'POST',
        url: getUrl('/uc/user/updateNickname'),
        query: UpdateNicknameParamsSchema.parse(params),
        body: {},
        transfer: UpdateNicknameResponseSchema.parse,
      }
    })
  )
}
