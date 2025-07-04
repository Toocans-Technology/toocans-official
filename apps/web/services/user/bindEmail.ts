import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindEmailParamsSchema = z.object({
  email: z.string().nullable(),
  verificationCode: z.string().nullable(),
  validEmail: z.boolean().nullable(),
})
export type BindEmailParams = z.infer<typeof BindEmailParamsSchema>

export const BindEmailResponseSchema = z.string()

export type BindEmailResponse = z.infer<typeof BindEmailResponseSchema>

export const useBindEmail = (params?: BindEmailParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/bindEmail'),
      body: params ? BindEmailParamsSchema.parse(params) : {},
      transfer: BindEmailResponseSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
