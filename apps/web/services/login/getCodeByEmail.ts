import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const CodeParamsSchema = z.object({ email: z.string() }).optional()

const WithdrawReqSchema = z.object({ code: z.string() })

export type a = z.infer<typeof CodeParamsSchema>

export const useCodeByEmail = (params?: z.infer<typeof CodeParamsSchema>) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/resource/email/code'),
      query: CodeParamsSchema.parse(params),
      transfer: WithdrawReqSchema.parse,
    }),
    enabled: !!params?.email,
  })
}
