import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BatchDeleteWithdrawAddressReqSchema = z.object({
  ids: z.array(z.string()),
})

export type BatchDeleteWithdrawAddressReq = z.infer<typeof BatchDeleteWithdrawAddressReqSchema>

export const useBatchDeleteWithdrawAddress = () => {
  return useMutation(
    getMutation((params: BatchDeleteWithdrawAddressReq) => ({
      method: 'POST',
      url: getUrl('/dw/withdrawAddress/batchDelete'),
      body: BatchDeleteWithdrawAddressReqSchema.parse(params),
      transfer: z.boolean().parse,
    }))
  )
}
