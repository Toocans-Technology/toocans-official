import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UnbindGoogleAuthParamsSchema = z.object({
  code: z.string().nullable(),
})
export type UnbindGoogleAuthParams = z.infer<typeof UnbindGoogleAuthParamsSchema>

export const UnbindGoogleAuthResponseSchema = z.object({}).nullable()
export type UnbindGoogleAuthResponse = z.infer<typeof UnbindGoogleAuthResponseSchema>

export const useUnbindGoogleAuth = (params: UnbindGoogleAuthParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/unbindGoogleAuth'),
      query: UnbindGoogleAuthParamsSchema.parse(params),
      body: {},
      transfer: UnbindGoogleAuthResponseSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
