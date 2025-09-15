/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawalSchema } from './schemas'

const WithdrawOrderListSchema = z.array(WithdrawalSchema)

const WithdrawOrderParamsSchema = z
  .object({
    pageNo: z.number(),
    pageSize: z.number(),
    tokenId: z.optional(z.string()),
    beginTime: z.optional(z.number()),
    endTime: z.optional(z.number()),
  })
  .optional()

export type WithdrawOrderParams = z.infer<typeof WithdrawOrderParamsSchema>

export const getWithdrawOrder = (params?: WithdrawOrderParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/dw/wallet/pageWithdraw'),
      query: WithdrawOrderParamsSchema.parse(params),
      transfer: WithdrawOrderListSchema.parse,
    }),
    staleTime: 0,
    refetchOnWindowFocus: true,
    // enabled: !!params?.tokenId,
  })
}
