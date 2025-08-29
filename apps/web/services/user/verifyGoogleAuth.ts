import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const VerifyGoogleAuthParamsSchema = z.object({
  code: z.string().nullable(),
  secretKey: z.string().nullable(),
})
export type VerifyGoogleAuthParams = z.infer<typeof VerifyGoogleAuthParamsSchema>

export const VerifyGoogleAuthResponseSchema = z.object({}).nullable()
export type VerifyGoogleAuthResponse = z.infer<typeof VerifyGoogleAuthResponseSchema>

export const useVerifyGoogleAuth = () => {
  return useMutation(
    getMutation((params: VerifyGoogleAuthParams) => {
      const formData = new FormData()
      if (params.code) formData.append('code', params.code)
      if (params.secretKey) formData.append('secretKey', params.secretKey)

      return {
        method: 'POST',
        url: getUrl('/uc/user/verifyGoogleAuth'),
        body: formData as any, // FIXME: formData type error
        transfer: VerifyGoogleAuthResponseSchema.parse,
      }
    })
  )
}
