import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useLogin } from '@/hooks'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const SymbolPairConfigSchema = z.object({
  id: z.string().nullable(),
  displaySymbol: z.string().nullable(),
  baseToken: z.string().nullable(),
  quoteToken: z.string().nullable(),
  cexName: z.string().nullable(),
  channelIndex: z.string().nullable(),
  rulePairInfo: z
    .object({
      ruleName: z.string().nullable(),
      displayPrecision: z.number().nullable().optional(),
      padWithZeros: z.number().nullable().optional(),
      roundMode: z.number().nullable().optional(),
    })
    .nullable(),
  state: z.number().nullable().optional(),
  sort: z.string().nullable(),
})

const UserFavoriteSchema = z.object({
  id: z.string().nullable(),
  userId: z.string().nullable(),
  symbolId: z.string().nullable(),
  customOrder: z.number().nullable().optional(),
  created: z.string().nullable(),
  marketPrice: z.string().nullable(),
  marketPriceChange: z.string().nullable(),
  symbolPairConfig: SymbolPairConfigSchema.nullable(),
})

const UserFavoritesResponseSchema = z.array(UserFavoriteSchema)

export type UserFavorite = z.infer<typeof UserFavoriteSchema>
export type UserFavoritesResponse = z.infer<typeof UserFavoritesResponseSchema>

export const useUserFavorites = () => {
  const { isLoggedIn } = useLogin()

  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/uc/user/allFavorite'),
      transfer: UserFavoritesResponseSchema.parse,
    }),
    enabled: isLoggedIn,
  })
}
