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

export const SendBindCodeResponseSchema = z.object({})
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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
