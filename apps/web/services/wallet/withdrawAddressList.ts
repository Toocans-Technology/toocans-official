import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawAddressSchema } from './schemas/address.schema'

const WithdrawAddressListSchema = z.array(WithdrawAddressSchema)

export type WithdrawAddressList = z.infer<typeof WithdrawAddressListSchema>

const WithdrawAddressParamsSchema = z
  .object({
    addressTypes: z.optional(z.string()), // 地址类型
    tokenId: z.optional(z.string()), // 币种ID
    tokenNetWorks: z.optional(z.array(z.string()).transform((val) => val.join(','))), // 币种网络
  })
  .optional()

export type WithdrawAddressParams = z.infer<typeof WithdrawAddressParamsSchema>

export const useWithdrawAddressList = (params?: WithdrawAddressParams, enabled: boolean = true) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/dw/withdrawAddress/list'),
      query: WithdrawAddressParamsSchema.parse(params),
      transfer: WithdrawAddressListSchema.parse,
    }),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}
