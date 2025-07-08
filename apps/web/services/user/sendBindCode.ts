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
    })
  )
}
