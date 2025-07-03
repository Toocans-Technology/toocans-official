import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const WithdrawReqSchema = z.object({
  accountId: z.number(),
  address: z.string(),
  tokenId: z.string(),
  addressTag: z.optional(z.string()),
  amount: z.number(),
  tokenFee: z.optional(z.number()),
  chargeType: z.optional(z.number()),
  code: z.number(),
  gaCode: z.optional(z.number()),
})

export type WithdrawReq = z.infer<typeof WithdrawReqSchema>

const WithdrawResSchema = z.object({
  id: z.number(),
  clientWithdrawalId: z.nullable(z.string()),
  transactionId: z.nullable(z.string()),
  accountId: z.number(),
  tokenId: z.nullable(z.string()),
  chainTokenId: z.nullable(z.string()),
  userId: z.number(),
  balanceId: z.number(),
  address: z.nullable(z.string()),
  addressTag: z.nullable(z.string()),
  arriveQuantity: z.number(),
  platformFee: z.number(),
  feeTokenId: z.nullable(z.string()),
  language: z.nullable(z.string()),
  status: z.number(),
  isCancel: z.boolean(),
  withdrawMethod: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  arriveTime: z.number(),
  totalQuantity: z.number(),
  txId: z.nullable(z.string()),
  txIdUrl: z.nullable(z.string()),
  extensionData: z.nullable(z.string()),
  feeCollected: z.boolean(),
  checkFlow: z.number(),
  cancelReason: z.number(),
  failedReason: z.nullable(z.string()),
  walletFee: z.number(),
  walletFeeToken: z.nullable(z.string()),
  tokenName: z.nullable(z.string()),
  protocolName: z.nullable(z.string()),
  chainName: z.nullable(z.string()),
  channelIcon: z.nullable(z.string()),
  transferUserNickName: z.nullable(z.string()),
  transferShowName: z.nullable(z.string()),
})

export type WithdrawRes = z.infer<typeof WithdrawResSchema>

export const useWithdraw = () => {
  return useMutation(
    getMutation((params: WithdrawReq) => ({
      method: 'POST',
      url: getUrl('/wallet/withdraw'),
      body: WithdrawReqSchema.parse(params),
      transfer: WithdrawResSchema.parse,
    }))
  )
}
