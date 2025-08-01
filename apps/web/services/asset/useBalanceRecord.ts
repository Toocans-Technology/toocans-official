import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export enum BusinessType {
  INVALID = 'INVALID',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  INTERNAL = 'INTERNAL',
  CONVERT = 'CONVERT',
}
export const BusinessTypeSchema = z.nativeEnum(BusinessType)

export const BalanceRecordParamsSchema = z.object({
  pageNo: z.number().nullable(),
  pageSize: z.number().nullable(),
  tokenId: z.string().optional(),
  beginTime: z.number().optional(),
  endTime: z.number().optional(),
  businessType: BusinessTypeSchema.optional(),
})

export type BalanceRecordParams = z.infer<typeof BalanceRecordParamsSchema>

export const BalanceChangeRecordSchema = z.object({
  id: z.string().nullable(),
  balanceId: z.string().nullable(),
  businessType: z.union([z.string().nullable(), z.number()]),
  businessId: z.string().nullable(),
  accountId: z.string().nullable(),
  tokenId: z.string().nullable(),
  tokenName: z.string().nullable(),
  amount: z.string().nullable(),
  beforeAmount: z.string().nullable(),
  createDate: z.union([z.string().nullable(), z.number()]),
})

export type BalanceChangeRecord = z.infer<typeof BalanceChangeRecordSchema>

export const BalanceRecordResponseSchema = z.array(BalanceChangeRecordSchema)

export type BalanceRecordResponse = z.infer<typeof BalanceRecordResponseSchema>

export const useBalanceRecord = (params: BalanceRecordParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/uc/balance/recordPage'),
      query: BalanceRecordParamsSchema.parse(params),
      transfer: BalanceRecordResponseSchema.parse,
    })
  )
}
