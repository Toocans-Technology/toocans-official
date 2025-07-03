import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindVerificationCodeParamsSchema = z.object({
  code: z.string().nullable(),
  googleCode: z.string().nullable(),
  idCard: z.string().nullable(),
})
export type BindVerificationCodeParams = z.infer<typeof BindVerificationCodeParamsSchema>

export const BindVerificationCodeResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: z.any().nullable(),
})
export type BindVerificationCodeResponse = z.infer<typeof BindVerificationCodeResponseSchema>

export const useBindVerificationCode = (params?: BindVerificationCodeParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/user/bindVerificationCode'),
      query: params ? BindVerificationCodeParamsSchema.parse(params) : {},
      transfer: BindVerificationCodeResponseSchema.parse,
    })
  )
}
