import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BusinessTypeEnum = ['INVALID', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'INTERNAL', 'CONVERT'] as const
export type BusinessType = (typeof BusinessTypeEnum)[number]

export const BalanceRecordParamsSchema = z.object({
  pageNo: z.number(),
  pageSize: z.number(),
  tokenId: z.string().optional(),
  beginTime: z.number().optional(),
  endTime: z.number().optional(),
  businessType: z.enum(BusinessTypeEnum).optional(),
})

export type BalanceRecordParams = z.infer<typeof BalanceRecordParamsSchema>

export const BalanceChangeRecordSchema = z.object({
  id: z.string(),
  balanceId: z.string(),
  businessType: z.union([z.string(), z.number()]),
  businessId: z.string(),
  accountId: z.string(),
  tokenId: z.string(),
  tokenName: z.string(),
  amount: z.string(),
  beforeAmount: z.string(),
  createDate: z.union([z.string(), z.number()]),
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
  id: z.string(),
  accountId: z.string(),
  tokenId: z.string(),
  userId: z.string(),
  total: z.string(),
  assetTotal: z.string(),
  availableAssetTotal: z.string(),
  marketPrice: z.string(),
  marketPriceChange: z.string(),
  locked: z.string(),
  available: z.string(),
  indebted: z.string(),
  createdAt: z.union([z.string(), z.number()]),
  updatedAt: z.union([z.string(), z.number()]),
  accountType: z.union([z.string(), z.number()]),
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

export const TokenSettingSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  allowDeposit: z.number(),
  allowWithdraw: z.number(),
  comingChainConfirmCount: z.number(),
  confirmedChainConfirmCount: z.number(),
  canWithdrawConfirmCount: z.number(),
  depositMinQuantity: z.string(),
  withdrawMinQuantity: z.string(),
  withdrawMaxDayQuantity: z.string(),
  withdrawChargeType: z.number(),
  withdrawChargeValue: z.string(),
  withdrawWithoutReviewDayQuantity: z.string(),
  addressNeedTag: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  blockExploreUrl: z.string(),
});

export type AllTokenItem = {
  id: string;
  tokenId: string;
  tokenName: string;
  tokenFullName: string;
  coboTokenId: string;
  chainTokenId: string;
  category: number;
  type: number;
  parentId: string | null;
  parentTokenId: string | null;
  isVirtual: number;
  addressType: string;
  isRealMoney: number;
  minPrecision: number;
  description: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
  icon: string;
  valueBasedTokenId: string | null;
  valueBasedTokenRate: string | null;
  maxQuantitySupplied: string;
  currentTurnover: string;
  officialWebsiteUrl: string;
  whitePaperUrl: string;
  publishTime: string;
  tokenIndex: string;
  protocolName: string | null;
  chainName: string | null;
  chainIcon: string;
  subTokenList: AllTokenItem[];
  tokenSetting: z.infer<typeof TokenSettingSchema>;
};

export const AllTokenItemSchema: z.ZodType<AllTokenItem> = z.lazy(() => z.object({
  id: z.string(),
  tokenId: z.string(),
  tokenName: z.string(),
  tokenFullName: z.string(),
  coboTokenId: z.string(),
  chainTokenId: z.string(),
  category: z.number(),
  type: z.number(),
  parentId: z.string().nullable(),
  parentTokenId: z.string().nullable(),
  isVirtual: z.number(),
  addressType: z.string(),
  isRealMoney: z.number(),
  minPrecision: z.number(),
  description: z.string().nullable(),
  status: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  icon: z.string(),
  valueBasedTokenId: z.string().nullable(),
  valueBasedTokenRate: z.string().nullable(),
  maxQuantitySupplied: z.string(),
  currentTurnover: z.string(),
  officialWebsiteUrl: z.string(),
  whitePaperUrl: z.string(),
  publishTime: z.string(),
  tokenIndex: z.string(),
  protocolName: z.string().nullable(),
  chainName: z.string().nullable(),
  chainIcon: z.string(),
  subTokenList: z.array(z.lazy(() => AllTokenItemSchema)),
  tokenSetting: TokenSettingSchema,
}));

export const AllTokenResponseSchema = z.array(AllTokenItemSchema)

export type AllTokenResponse = z.infer<typeof AllTokenResponseSchema>;

export const useAllToken = (tokenId?: string) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/baseConfig/allToken'),
      query: tokenId ? { tokenId } : {},
      transfer: AllTokenResponseSchema.parse,
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJwYzoxODkyMTUzNTYzMDgyMjk3MzQ0Iiwicm5TdHIiOiI3dDhqSUdxR2VHZU16ZmRnOW5vajFRbm1LY0NzVUJ4RyIsImNsaWVudGlkIjoiYzI0N2E4M2IwNGRlMTlhOTU1Zjk4OTlhNDg1ZmQzMzAiLCJ1c2VySWQiOjE4OTIxNTM1NjMwODIyOTczNDR9.EfzwIKhhUlKxQJWY75yFhWqAkgAI63IgY8t1rv112yM'
      }
    })
  );
};
