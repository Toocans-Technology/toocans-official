import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindEmailParamsSchema = z.object({
  email: z.string().nullable(),
  verificationCode: z.string().nullable(),
  validEmail: z.boolean().nullable(),
})
export type BindEmailParams = z.infer<typeof BindEmailParamsSchema>

export const BindEmailResponseSchema = z.string()

export type BindEmailResponse = z.infer<typeof BindEmailResponseSchema>

export const useBindEmail = () => {
  return useMutation(
    getMutation((params: BindEmailParams) => ({
      method: 'POST',
      url: getUrl('/user/bindEmail'),
      body: BindEmailParamsSchema.parse(params),
      transfer: BindEmailResponseSchema.parse,
    }))
  )
}
