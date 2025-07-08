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
    })
  )
}
