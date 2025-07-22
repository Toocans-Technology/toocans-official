import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { businessTypeSchema } from '@/types/user'

const RecordSchema = z.object({
  id: z.number(),
  balanceId: z.number(),
  businessType: businessTypeSchema,
  businessId: z.number(),
  accountId: z.number(),
  tokenId: z.string().nullable(),
  tokenName: z.string().nullable(),
  amount: z.number(),
  beforeAmount: z.number(),
  createDate: z.number(),
})

export type Record = z.infer<typeof RecordSchema>

const RecordListSchema = z.object({
  total: z.string(),
  pages: z.number(),
  pageNum: z.number(),
  pageSize: z.number(),
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  list: z.array(RecordSchema),
})

const RecordParamsSchema = z
  .object({
    pageNo: z.number(),
    pageSize: z.number(),
    businessType: businessTypeSchema,
    tokenId: z.string().optional(),
    beginTime: z.number().optional(),
    endTime: z.number().optional(),
  })
  .optional()

export type RecordParams = z.infer<typeof RecordParamsSchema>

export const getRecordList = (params?: RecordParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/uc/balance/recordPageInfo'),
      query: RecordParamsSchema.parse(params),
      transfer: RecordListSchema.parse,
    })
  )
}
