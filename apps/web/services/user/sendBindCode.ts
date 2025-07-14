import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const SendBindCodeParamsSchema = z
  .object({
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: 'phone or email is required',
  })
  .refine(
    (data) => {
      if (data.phone && !data.countryCode) {
        return false
      }
      return true
    },
    {
      message: 'countryCode is required when phone is provided',
    }
  )

export type SendBindCodeParams = z.infer<typeof SendBindCodeParamsSchema>

export const SendBindCodeResponseSchema = z.object({}).nullable()
export type SendBindCodeResponse = z.infer<typeof SendBindCodeResponseSchema>

export const useSendBindCode = () => {
  return useMutation(
    getMutation((params: SendBindCodeParams) => ({
      method: 'POST',
      url: getUrl('/user/sendBindCode'),
      body: SendBindCodeParamsSchema.parse(params),
      transfer: SendBindCodeResponseSchema.parse,
    }))
  )
}
