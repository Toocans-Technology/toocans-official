import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawalSchema } from './schemas'

const WithdrawOrderListSchema = z.object({
  total: z.string(),
  pages: z.number(),
  pageNum: z.number(),
  pageSize: z.number(),
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  list: z.array(WithdrawalSchema),
})

const WithdrawOrderParamsSchema = z
  .object({
    pageNo: z.number(),
    pageSize: z.number(),
    tokenId: z.optional(z.string()),
    beginTime: z.optional(z.number()),
    endTime: z.optional(z.number()),
  })
  .optional()

type WithdrawOrderParams = z.infer<typeof WithdrawOrderParamsSchema>

export const getWithdrawOrderList = (params?: WithdrawOrderParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/dw/wallet/pageInfoWithdraw'),
      query: WithdrawOrderParamsSchema.parse(params),
      transfer: WithdrawOrderListSchema.parse,
    })
  )
}
