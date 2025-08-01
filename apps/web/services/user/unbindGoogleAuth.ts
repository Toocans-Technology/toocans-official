import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UnbindGoogleAuthParamsSchema = z.object({
  code: z.string(),
})

export type UnbindGoogleAuthParams = z.infer<typeof UnbindGoogleAuthParamsSchema>

export const UnbindGoogleAuthResponseSchema = z.object({}).nullable()
export type UnbindGoogleAuthResponse = z.infer<typeof UnbindGoogleAuthResponseSchema>

export const useUnbindGoogleAuth = () => {
  return useMutation(
    getMutation((params: UnbindGoogleAuthParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/unbindGoogleAuth'),
      query: UnbindGoogleAuthParamsSchema.parse(params),
      body: {},
      transfer: UnbindGoogleAuthResponseSchema.parse,
    }))
  )
}
