import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const UserSchema = z.object({
  uid: z.string(),
  nickName: z.string(),
})

export type User = z.infer<typeof UserSchema>

export type ExtendedUser = User & {
  email?: string
  phone?: string
}

const SearchUserParamsSchema = z
  .object({
    searchKey: z.optional(z.string()), // UID、邮箱或 手机号码
    type: z.optional(z.number().refine((val) => [1, 2, 3].includes(val), { message: 'type must be 1, 2 or 3' })), // 1:UID、2:邮箱 3:手机号码
  })
  .optional()

export type SearchUserParams = z.infer<typeof SearchUserParamsSchema>

export const useSearchUser = (params?: SearchUserParams, enabled: boolean = false) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/dw/withdraw/searchUser'),
      query: SearchUserParamsSchema.parse(params),
      transfer: UserSchema.parse,
    }),
    retry: false,
    enabled: !!params?.searchKey && !!params?.type && enabled,
  })
}
