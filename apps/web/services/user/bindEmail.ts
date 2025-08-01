import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { EMAIL_REGEX } from '@/lib/utils'

export const BindEmailParamsSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Please input a right email!'),
  verificationCode: z.string(),
  validEmail: z.boolean().optional(),
})
export type BindEmailParams = z.infer<typeof BindEmailParamsSchema>

export const BindEmailResponseSchema = z.string().nullable()

export type BindEmailResponse = z.infer<typeof BindEmailResponseSchema>

export const useBindEmail = () => {
  return useMutation(
    getMutation((params: BindEmailParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/bindEmail'),
      body: BindEmailParamsSchema.parse(params),
      transfer: BindEmailResponseSchema.parse,
    }))
  )
}
