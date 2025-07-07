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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
