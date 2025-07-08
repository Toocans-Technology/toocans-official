import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const SendCodeByUserPhoneOrEmailResponseSchema = z.object({})
export type SendCodeByUserPhoneOrEmailResponse = z.infer<typeof SendCodeByUserPhoneOrEmailResponseSchema>

export const useSendCodeByUserPhoneOrEmail = () => {
  return useQuery(
    getQuery({
      method: 'POST',
      url: getUrl('/user/sendCodeByUserPhoneOrEmail'),
      body: {},
      transfer: SendCodeByUserPhoneOrEmailResponseSchema.parse,
    })
  )
}
