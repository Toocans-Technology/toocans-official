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
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
