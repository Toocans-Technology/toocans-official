/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useLogin } from '@/hooks'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { allowDepositSchema, allowWithdrawSchema, withdrawChargeTypeSchema } from '@/types/token'

const TokenSettingSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  allowDeposit: allowDepositSchema,
  allowWithdraw: allowWithdrawSchema,
  comingChainConfirmCount: z.number(),
  confirmedChainConfirmCount: z.number(),
  canWithdrawConfirmCount: z.number(),
  depositMinQuantity: z.string(),
  withdrawMinQuantity: z.string(),
  withdrawMaxDayQuantity: z.string(),
  withdrawChargeType: withdrawChargeTypeSchema,
  withdrawChargeValue: z.string(),
  withdrawWithoutReviewDayQuantity: z.string(),
  addressNeedTag: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  blockExploreUrl: z.string().nullable(),
  tokenPrecisionAutoVO: z.object({
    displayPrecision: z.number(),
    padWithZeros: z.number(),
    roundMode: z.number(),
    ruleName: z.string(),
  }),
})

const TokenSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  tokenName: z.string(),
  tokenFullName: z.string(),
  coboTokenId: z.string().nullable(),
  chainTokenId: z.string().nullable(),
  category: z.number(),
  type: z.number(),
  parentId: z.number().nullable(),
  parentTokenId: z.string().nullable(),
  isVirtual: z.number(),
  addressType: z.string(),
  isRealMoney: z.number(),
  minPrecision: z.number(),
  description: z.string().nullable(),
  status: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  icon: z.string().nullable(),
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
  chainIcon: z.string().nullable(),
  subTokenList: z.array(z.any()), // Empty array, but if nested structure, use recursion or define properly
  tokenSetting: TokenSettingSchema.nullable(),
})

export type Token = z.infer<typeof TokenSchema>

const AllTokenSchema = z.array(TokenSchema)

const AllTokenParamsSchema = z
  .object({
    tokenId: z.string(),
  })
  .optional()

export type AllTokenParams = z.infer<typeof AllTokenParamsSchema>

export const getAllToken = (params?: AllTokenParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/bc/baseConfig/allToken'),
      query: AllTokenParamsSchema.parse(params),
      transfer: AllTokenSchema.parse,
    }),
  })
}
