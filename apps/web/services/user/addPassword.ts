import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const AddPasswordParamsSchema = z.object({
  password: z.string().min(8).max(32),
})

export type AddPasswordParams = z.infer<typeof AddPasswordParamsSchema>

export const AddPasswordResponseSchema = z.nullable(z.boolean())

export type AddPasswordResponse = z.infer<typeof AddPasswordResponseSchema>

export const useAddPassword = () => {
  return useMutation(
    getMutation((params: AddPasswordParams) => {
      return {
        method: 'POST',
        url: getUrl('/uc/user/addPassword'),
        body: AddPasswordParamsSchema.parse(params),
        transfer: AddPasswordResponseSchema.parse,
      }
    })
  )
}
