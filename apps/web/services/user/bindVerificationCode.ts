import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindVerificationCodeParamsSchema = z.object({
  code: z.string(),
  googleCode: z.string().optional(),
  idCard: z.string().optional(),
})
export type BindVerificationCodeParams = z.infer<typeof BindVerificationCodeParamsSchema>

export const BindVerificationCodeResponseSchema = z.any({})
export type BindVerificationCodeResponse = z.infer<typeof BindVerificationCodeResponseSchema>

export const useBindVerificationCode = () => {
  return useMutation(
    getMutation((params: BindVerificationCodeParams) => ({
      method: 'POST',
      url: getUrl('/uc/user/bindVerificationCode'),
      query: BindVerificationCodeParamsSchema.parse(params),
      body: {},
      transfer: BindVerificationCodeResponseSchema.parse,
    }))
  )
}
