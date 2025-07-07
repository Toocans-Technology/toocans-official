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
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
