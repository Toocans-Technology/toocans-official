import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const UserSchema = z.object({
  userId: z.nullable(z.string()),
  nationalCode: z.nullable(z.string()),
  mobile: z.nullable(z.string()),
  email: z.nullable(z.string()),
  registerType: z.number(),
  concatMobile: z.nullable(z.string()),
  userType: z.number(),
  clientId: z.nullable(z.string()),
  clientKey: z.nullable(z.string()),
  clientSecret: z.nullable(z.string()),
  grantType: z.nullable(z.string()),
  deviceType: z.nullable(z.string()),
  accountId: z.nullable(z.string()),
  setPassword: z.boolean(),
  kycLevel: z.number(),
  language: z.nullable(z.string()),
  hasGaKey: z.boolean(),
  nickname: z.nullable(z.string()),
  avatar: z.nullable(z.string()),
  loginName: z.nullable(z.string()),
  mobileRegistration: z.boolean(),
  emailRegistration: z.boolean(),
  loginId: z.nullable(z.string()),
})

export type User = z.infer<typeof UserSchema>

export const getUserInfo = () => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/user/info'),
      transfer: UserSchema.parse,
    }),
  })
}
