import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const WithdrawInfoSchema = z
  .object({
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
  .nullable()

export type WithdrawInfo = z.infer<typeof WithdrawInfoSchema>

export const getWithdrawInfo = (id: number) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl(`/wallet/withdrawInfo/${id}`),
      transfer: WithdrawInfoSchema.parse,
    }),
    enabled: !!id,
  })
}
