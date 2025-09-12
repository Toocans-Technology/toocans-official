import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const DeleteFavoriteParamsSchema = z.object({
  symbolIds: z.array(z.string()).nullable(),
})
export type DeleteFavoriteParams = z.infer<typeof DeleteFavoriteParamsSchema>

export const DeleteFavoriteResponseSchema = z.boolean().nullable()

export type DeleteFavoriteResponse = z.infer<typeof DeleteFavoriteResponseSchema>

export const useDeleteFavorite = () => {
  return useMutation(
    getMutation((params: DeleteFavoriteParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/deleteFavorite'),
      body: DeleteFavoriteParamsSchema.parse(params),
      transfer: DeleteFavoriteResponseSchema.parse,
    }))
  )
}
