import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindPhoneParamsSchema = z.object({
  nationalCode: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  verificationCode: z.string().nullable(),
  fullPhoneNumber: z.string().nullable(),
  validPhoneNumber: z.boolean().nullable(),
})
export type BindPhoneParams = z.infer<typeof BindPhoneParamsSchema>

export const BindPhoneResponseSchema = z.string()
export type BindPhoneResponse = z.infer<typeof BindPhoneResponseSchema>

export const useBindPhone = (params?: BindPhoneParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/bindPhone'),
      body: params ? BindPhoneParamsSchema.parse(params) : {},
      transfer: BindPhoneResponseSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM',
      },
    })
  )
}
