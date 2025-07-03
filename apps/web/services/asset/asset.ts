import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BusinessTypeEnum = ['INVALID', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'INTERNAL', 'CONVERT'] as const
export type BusinessType = (typeof BusinessTypeEnum)[number]

export const BalanceRecordParamsSchema = z.object({
  pageNo: z.number().nullable(),
  pageSize: z.number().nullable(),
  tokenId: z.string().optional(),
  beginTime: z.number().optional(),
  endTime: z.number().optional(),
  businessType: z.enum(BusinessTypeEnum).optional(),
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

export const BalanceRecordResponseSchema = z.array(BalanceChangeRecordSchema);

export type BalanceRecordResponse = z.infer<typeof BalanceRecordResponseSchema>

export const useBalanceRecord = (params: BalanceRecordParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/balance/recordPage'),
      query: BalanceRecordParamsSchema.parse(params),
      transfer: BalanceRecordResponseSchema.parse,
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM'
      }
    })
  )
}

// 查询用户所有资产
export const GetAllAssetParamsSchema = z.object({
  tokenId: z.string().optional(),
})
export type GetAllAssetParams = z.infer<typeof GetAllAssetParamsSchema>

export const BalanceVoSchema = z.object({
  id: z.string().nullable(),
  accountId: z.string().nullable(),
  tokenId: z.string().nullable(),
  userId: z.string().nullable(),
  total: z.string().nullable(),
  assetTotal: z.string().nullable(),
  availableAssetTotal: z.string().nullable(),
  marketPrice: z.string().nullable(),
  marketPriceChange: z.string().nullable(),
  locked: z.string().nullable(),
  available: z.string().nullable(),
  indebted: z.string().nullable(),
  createdAt: z.union([z.string().nullable(), z.number()]),
  updatedAt: z.union([z.string().nullable(), z.number()]),
  accountType: z.union([z.string().nullable(), z.number()]),
  configMarketQuotation: z.boolean(),
})

const GetAllAssetResponseSchema = z.array(BalanceVoSchema)

export type GetAllAssetResponse = z.infer<typeof GetAllAssetResponseSchema>

export const useGetAllAsset = (params?: GetAllAssetParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/balance/getAllAsset'),
      query: params ? GetAllAssetParamsSchema.parse(params) : {},
      transfer: GetAllAssetResponseSchema.parse,
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM'
      }
    })
  )
}