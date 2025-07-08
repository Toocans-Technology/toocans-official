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

export const BindVerificationCodeResponseSchema = z.any({})
export type BindVerificationCodeResponse = z.infer<typeof BindVerificationCodeResponseSchema>

export const useBindVerificationCode = (params?: BindVerificationCodeParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/bindVerificationCode'),
      query: params ? BindVerificationCodeParamsSchema.parse(params) : {},
      body: {},
      transfer: BindVerificationCodeResponseSchema.parse,
    })
  )
}
