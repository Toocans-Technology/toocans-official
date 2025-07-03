import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const VerifyGoogleAuthParamsSchema = z.object({
  code: z.string().nullable(),
  secretKey: z.string().nullable(),
})
export type VerifyGoogleAuthParams = z.infer<typeof VerifyGoogleAuthParamsSchema>

export const VerifyGoogleAuthResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: z.any().nullable(),
})
export type VerifyGoogleAuthResponse = z.infer<typeof VerifyGoogleAuthResponseSchema>

export const useVerifyGoogleAuth = (params: VerifyGoogleAuthParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/user/verifyGoogleAuth'),
      query: VerifyGoogleAuthParamsSchema.parse(params),
      transfer: VerifyGoogleAuthResponseSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
