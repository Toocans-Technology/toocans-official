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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
