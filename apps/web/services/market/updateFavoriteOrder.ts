import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UpdateFavoriteOrderParamsSchema = z.object({
  orders: z.array(
    z.object({
      symbolId: z.string(),
      customOrder: z.number(),
    })
  ),
})
export type UpdateFavoriteOrderParams = z.infer<typeof UpdateFavoriteOrderParamsSchema>

export const UpdateFavoriteOrderResponseSchema = z.record(z.unknown()).nullable()

export type UpdateFavoriteOrderResponse = z.infer<typeof UpdateFavoriteOrderResponseSchema>

export const useUpdateFavoriteOrder = () => {
  return useMutation(
    getMutation((params: UpdateFavoriteOrderParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/updateFavoriteOrder'),
      body: UpdateFavoriteOrderParamsSchema.parse(params),
      transfer: UpdateFavoriteOrderResponseSchema.parse,
    }))
  )
}