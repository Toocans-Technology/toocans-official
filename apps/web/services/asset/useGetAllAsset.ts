import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useLogin } from '@/hooks'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const GetAllAssetParamsSchema = z
  .object({
    tokenId: z.string().optional(),
  })
  .optional()

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
  const { isLoggedIn } = useLogin()

  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/uc/balance/getAllAsset'),
      query: GetAllAssetParamsSchema.parse(params),
      transfer: GetAllAssetResponseSchema.parse,
    }),
    enabled: isLoggedIn && (params ? !!params?.tokenId : true),
  })
}
