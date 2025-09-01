import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawalSchema } from './schemas'

const UpdateWithdrawAddressReqSchema = z.object({
  id: z.string(),
  addressName: z.string().min(1).max(20),
})

export type UpdateWithdrawAddressReq = z.infer<typeof UpdateWithdrawAddressReqSchema>

export const useUpdateWithdrawAddress = () => {
  return useMutation(
    getMutation((params: UpdateWithdrawAddressReq) => ({
      method: 'POST',
      url: getUrl('/dw/withdrawAddress/update'),
      body: UpdateWithdrawAddressReqSchema.parse(params),
      transfer: WithdrawalSchema.parse,
    }))
  )
}
