import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const AddFavoriteParamsSchema = z.object({
  favorites: z
    .array(
      z.object({
        symbolId: z.string().nullable(),
        customOrder: z.number().nullable().optional(),
      })
    )
    .nullable(),
})
export type AddFavoriteParams = z.infer<typeof AddFavoriteParamsSchema>
export const AddFavoriteResponseSchema = z.boolean().nullable()
export type AddFavoriteResponse = z.infer<typeof AddFavoriteResponseSchema>

export const useAddFavorite = () => {
  return useMutation(
    getMutation((params: AddFavoriteParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/addFavorite'),
      body: AddFavoriteParamsSchema.parse(params),
      transfer: AddFavoriteResponseSchema.parse,
    }))
  )
}
