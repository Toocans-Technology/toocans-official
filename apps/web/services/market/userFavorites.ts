import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useLogin } from '@/hooks'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const SymbolPairConfigSchema = z.object({
  id: z.number().nullable(),
  displaySymbol: z.string().nullable(),
  baseToken: z.string().nullable(),
  quoteToken: z.string().nullable(),
  cexName: z.string().nullable(),
  channelIndex: z.string().nullable(),
  rulePairInfo: z.string().nullable(),
  state: z.number().nullable(),
  sort: z.number().nullable(),
})

const UserFavoriteSchema = z.object({
  id: z.number().nullable(),
  userId: z.number().nullable(),
  symbolId: z.string().nullable(),
  customOrder: z.number().nullable(),
  created: z.number().nullable(),
  marketPrice: z.number().nullable(),
  marketPriceChange: z.number().nullable(),
  symbolPairConfig: SymbolPairConfigSchema.nullable(),
})

const UserFavoritesResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: z.array(UserFavoriteSchema).nullable(),
})

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
