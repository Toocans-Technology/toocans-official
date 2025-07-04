import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const EmailSchema = z.object({})

export type Email = z.infer<typeof EmailSchema>

const EmailParamsSchema = z
  .object({
    email: z.string(),
  })
  .optional()

export type EmailParams = z.infer<typeof EmailParamsSchema>

export const getEmailCode = (params?: EmailParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/resource/email/code'),
      query: EmailParamsSchema.parse(params),
      transfer: EmailSchema.parse,
    }),
    enabled: !!params?.email,
  })
}
