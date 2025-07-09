import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UserInfoDataSchema = z.object({
  accountId: z.string(),
  userId: z.string(),
  nationalCode: z.string().nullable(),
  mobile: z.string().nullable(),
  email: z.string().nullable(),
  registerType: z.number(),
  concatMobile: z.string().nullable(),
  userType: z.number(),
  clientId: z.string().nullable(),
  clientKey: z.string().nullable(),
  clientSecret: z.string().nullable(),
  grantType: z.string().nullable(),
  deviceType: z.string().nullable(),
  setPassword: z.boolean(),
  kycLevel: z.number(),
  language: z.string().nullable(),
  hasGaKey: z.boolean(),
  nickname: z.string().nullable(),
  avatar: z.string().nullable(),
  mobileRegistration: z.boolean(),
  emailRegistration: z.boolean(),
  loginId: z.string().nullable(),
  loginName: z.string().nullable(),
})

export const useUserInfo = () => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/user/info'),
      transfer: UserInfoDataSchema.parse,
    })
  )
}
