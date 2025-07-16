import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const DepositOrderSchema = z.object({
  id: z.string(),
  notifyId: z.nullable(z.string()),
  depositMethod: z.number(),
  accountId: z.nullable(z.string()),
  tokenId: z.string(),
  chainTokenId: z.string(),
  quantity: z.nullable(z.string()),
  fromAddress: z.nullable(z.string()),
  walletAddress: z.nullable(z.string()),
  walletAddressTag: z.nullable(z.string()),
  txId: z.nullable(z.string()),
  status: z.nullable(z.number()),
  createdAt: z.nullable(z.string()),
  updatedAt: z.nullable(z.number()),
  blockTime: z.nullable(z.number()),
  walletHandleTime: z.nullable(z.number()),
  targetConfirmNum: z.nullable(z.number()),
  confirmNum: z.nullable(z.number()),
  txIdUrl: z.nullable(z.string()),
  depositReceiptType: z.nullable(z.number()),
  cannotReceiptReason: z.nullable(z.number()),
  userId: z.nullable(z.string()),
  tokenName: z.nullable(z.string()),
})

export type DepositOrder = z.infer<typeof DepositOrderSchema>

const DepositOrderListSchema = z.array(DepositOrderSchema)

const DepositOrderParamsSchema = z
  .object({
    pageNo: z.number(),
    pageSize: z.number(),
    tokenId: z.string().optional(),
    beginTime: z.number().optional(),
    endTime: z.number().optional(),
  })
  .optional()

export type DepositOrderParams = z.infer<typeof DepositOrderParamsSchema>

export const getDepositOrder = (params?: DepositOrderParams) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/dw/wallet/pageDepositOrder'),
      query: DepositOrderParamsSchema.parse(params),
      transfer: DepositOrderListSchema.parse,
    }),
    // enabled: !!params?.tokenId,
  })
}
