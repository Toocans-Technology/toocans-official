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
      formData.append('code', params.code ?? '')
      formData.append('secretKey', params.secretKey ?? '')
      return {
        method: 'POST',
        url: getUrl('/user/verifyGoogleAuth'),
        body: formData,
        transfer: VerifyGoogleAuthResponseSchema.parse,
      }
    })
  )
}
