/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const AddressSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  userId: z.string(),
  balanceId: z.string(),
  tokenId: z.string(),
  address: z.string(),
  addressType: z.nullable(z.string()),
  notifyLanguage: z.nullable(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  signTime: z.nullable(z.string()),
  signNonce: z.nullable(z.string()),
  signWallet: z.nullable(z.string()),
  signWalletRc: z.nullable(z.string()),
  tag: z.nullable(z.string()),
  tagFromWallet: z.nullable(z.boolean()),
  invalidVersion: z.nullable(z.number()),
})

export type Address = z.infer<typeof AddressSchema>

const AddressParamsSchema = z
  .object({
    tokenId: z.string().optional(),
  })
  .optional()

export type AddressParams = z.infer<typeof AddressParamsSchema>

export const getAddress = (params?: AddressParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/dw/wallet/address'),
      query: AddressParamsSchema.parse(params),
      transfer: AddressSchema.parse,
    }),
    enabled: !!params?.tokenId,
  })
}
