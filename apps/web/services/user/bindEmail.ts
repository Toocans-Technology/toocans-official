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

export const BindEmailResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: z.string().nullable(),
})

export type BindEmailResponse = z.infer<typeof BindEmailResponseSchema>

export const useBindEmail = (params?: BindEmailParams) => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/bindEmail'),
      body: params ? BindEmailParamsSchema.parse(params) : {},
      transfer: BindEmailResponseSchema.parse,
    })
  )
}
