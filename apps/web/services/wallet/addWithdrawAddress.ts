import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { addressTypeSchema } from '@/types/withdraw'
import { WithdrawAddressSchema } from './schemas'

export const AddWithdrawAddressReqSchema = z.object({
  tokenId: z.string(),
  addressName: z.optional(z.string()),
  addressType: addressTypeSchema, // 类型1，链上地址，2 uid,3 email，4 phone
  chainType: z.optional(z.string()),
  tokenNetWork: z.string(),
  address: z.string(),
  addressExt: z.optional(z.string()).nullable(),
  remark: z.optional(z.string()).nullable(),
})

export type AddWithdrawAddressReq = z.infer<typeof AddWithdrawAddressReqSchema>

export const useAddWithdrawAddress = () => {
  return useMutation(
    getMutation((params: AddWithdrawAddressReq) => ({
      method: 'POST',
      url: getUrl('/dw/withdrawAddress/add'),
      body: AddWithdrawAddressReqSchema.parse(params),
      transfer: WithdrawAddressSchema.parse,
    }))
  )
}
