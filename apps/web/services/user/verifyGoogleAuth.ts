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
    })
  )
}
