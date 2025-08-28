import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { chargeTypeSchema } from '@/types/withdraw'
import { WithdrawalSchema } from './schemas'

const WithdrawReqSchema = z.object({
  accountId: z.string(),
  address: z.string(), // 如果内部转账， address 为 userId，否则为地址
  tokenId: z.string(),
  addressTag: z.optional(z.string()), // 如果是内部转账，addressTag 为 1:UID、2:邮箱 3:手机号码
  amount: z.number(),
  tokenFee: z.optional(z.number()),
  chargeType: chargeTypeSchema, // 提现类型 1:普通提现 2:内部转账
  code: z.string(),
  gaCode: z.optional(z.string()),
})

export type WithdrawReq = z.infer<typeof WithdrawReqSchema>

export const useWithdraw = () => {
  return useMutation(
    getMutation((params: WithdrawReq) => ({
      method: 'POST',
      url: getUrl('/dw/withdraw/withdraw'),
      body: WithdrawReqSchema.parse(params),
      transfer: WithdrawalSchema.parse,
    }))
  )
}
