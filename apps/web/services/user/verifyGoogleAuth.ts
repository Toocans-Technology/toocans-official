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
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
        },
      }
    })
  )
}
