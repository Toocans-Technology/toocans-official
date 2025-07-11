import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const BindPhoneParamsSchema = z.object({
  nationalCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  verificationCode: z.string().optional(),
  fullPhoneNumber: z.string().optional(),
  validPhoneNumber: z.boolean().optional(),
})

export type BindPhoneParams = z.infer<typeof BindPhoneParamsSchema>

export const BindPhoneResponseSchema = z.string()
export type BindPhoneResponse = z.infer<typeof BindPhoneResponseSchema>

export const useBindPhone = () => {
  return useMutation(
    getMutation((params: BindPhoneParams) => ({
      method: 'POST',
      url: getUrl('/user/bindPhone'),
      body: BindPhoneParamsSchema.parse(params),
      transfer: BindPhoneResponseSchema.parse,
    }))
  )
}
