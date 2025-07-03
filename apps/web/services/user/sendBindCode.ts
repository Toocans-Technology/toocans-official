import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const SendBindCodeParamsSchema = z.object({
  countryCode: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
})
export type SendBindCodeParams = z.infer<typeof SendBindCodeParamsSchema>

export const SendBindCodeResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: z.any().nullable(),
})
export type SendBindCodeResponse = z.infer<typeof SendBindCodeResponseSchema>

export const useSendBindCode = (params?: SendBindCodeParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/sendBindCode'),
      body: params ? SendBindCodeParamsSchema.parse(params) : {},
      transfer: SendBindCodeResponseSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
