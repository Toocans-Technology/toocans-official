import { z } from 'zod'
import { withdrawalStatusSchema, withdrawMethodSchema } from '@/types/withdraw'

export const WithdrawalSchema = z.object({
  id: z.string(),
  clientWithdrawalId: z.nullable(z.string()),
  transactionId: z.nullable(z.string()),
  accountId: z.string(),
  tokenId: z.nullable(z.string()),
  chainTokenId: z.nullable(z.string()),
  userId: z.string(),
  balanceId: z.string(),
  address: z.nullable(z.string()),
  addressTag: z.nullable(z.string()),
  arriveQuantity: z.string(),
  platformFee: z.string(),
  feeTokenId: z.nullable(z.string()), // 手续费tokenId。是tokenId, 或者是 miner_fee_token_id
  language: z.nullable(z.string()),
  status: withdrawalStatusSchema,
  isCancel: z.nullable(z.boolean()),
  withdrawMethod: withdrawMethodSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  arriveTime: z.nullable(z.string()),
  totalQuantity: z.string(),
  txId: z.nullable(z.string()),
  txIdUrl: z.nullable(z.string()),
  extensionData: z.nullable(z.string()),
  feeCollected: z.nullable(z.boolean()),
  checkFlow: z.nullable(z.number()),
  cancelReason: z.nullable(z.number()),
  failedReason: z.nullable(z.string()),
  walletFee: z.nullable(z.string()),
  walletFeeToken: z.nullable(z.string()),
  tokenName: z.nullable(z.string()),
  protocolName: z.nullable(z.string()),
  chainName: z.nullable(z.string()),
  channelIcon: z.nullable(z.string()),
  transferUserNickName: z.nullable(z.string()),
  transferShowName: z.nullable(z.string()),
})

export type Withdrawal = z.infer<typeof WithdrawalSchema>
