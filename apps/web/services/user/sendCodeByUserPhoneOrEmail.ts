import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const SendCodeByUserPhoneOrEmailResponseSchema = z.object({}).nullable()
export type SendCodeByUserPhoneOrEmailResponse = z.infer<typeof SendCodeByUserPhoneOrEmailResponseSchema>

export const useSendCodeByUserPhoneOrEmail = () => {
  return useMutation(
    getMutation(() => ({
      method: 'POST',
      url: getUrl('/uc/user/sendCodeByUserPhoneOrEmail'),
      body: {},
      transfer: SendCodeByUserPhoneOrEmailResponseSchema.parse,
    }))
  )
}
