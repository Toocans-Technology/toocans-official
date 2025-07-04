import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UnbindGoogleAuthParamsSchema = z.object({
  code: z.string().nullable(),
})
export type UnbindGoogleAuthParams = z.infer<typeof UnbindGoogleAuthParamsSchema>

export const UnbindGoogleAuthResponseSchema = z.object({})
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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
