import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawalSchema } from './schemas'

const WithdrawReqSchema = z.object({
  accountId: z.string(),
  address: z.string(),
  tokenId: z.string(),
  addressTag: z.optional(z.string()),
  amount: z.number(),
  tokenFee: z.optional(z.number()),
  chargeType: z.optional(z.number()),
  code: z.string(),
  gaCode: z.optional(z.string()),
})

export type WithdrawReq = z.infer<typeof WithdrawReqSchema>

export const useWithdraw = () => {
  return useMutation(
    getMutation((params: WithdrawReq) => ({
      method: 'POST',
      url: getUrl('/wallet/withdraw'),
      body: WithdrawReqSchema.parse(params),
      transfer: WithdrawalSchema.parse,
    }))
  )
}
