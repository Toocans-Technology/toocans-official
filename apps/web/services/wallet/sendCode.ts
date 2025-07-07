import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { verifyTypeSchema } from '@/types/withdraw'

const CodeResSchema = z.object({})

export type CodeRes = z.infer<typeof CodeResSchema>

const CodeParamsSchema = z
  .object({
    type: verifyTypeSchema,
  })
  .optional()

export type CodeParams = z.infer<typeof CodeParamsSchema>

export const getVerifyCode = (params?: CodeParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/wallet/send/code'),
      query: CodeParamsSchema.parse(params),
      transfer: CodeResSchema.parse,
    }),
    enabled: !!params?.type,
  })
}
