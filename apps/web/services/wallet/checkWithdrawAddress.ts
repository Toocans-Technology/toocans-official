import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const CheckWithdrawAddressParamsSchema = z.object({
  tokenId: z.string(), // 币种ID
  address: z.string(), // 地址
})

export type CheckWithdrawAddressParams = z.infer<typeof CheckWithdrawAddressParamsSchema>

export const useCheckWithdrawAddress = (params?: CheckWithdrawAddressParams) => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/dw/withdrawAddress/checkAddress'),
      query: CheckWithdrawAddressParamsSchema.parse(params),
      transfer: z.object({}).parse,
    })
  )
}
