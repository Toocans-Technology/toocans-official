import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const UserInfoDataSchema = z.object({
  userId: z.string().nullable(),
  nationalCode: z.string().nullable(),
  mobile: z.string().nullable(),
  email: z.string().nullable(),
  registerType: z.number().nullable(),
  concatMobile: z.string().nullable(),
  userType: z.number().nullable(),
  clientId: z.string().nullable(),
  clientKey: z.string().nullable(),
  clientSecret: z.string().nullable(),
  grantType: z.string().nullable(),
  deviceType: z.string().nullable(),
  accountId: z.string().nullable(),
  setPassword: z.boolean().nullable(),
  kycLevel: z.number().nullable(),
  language: z.string().nullable(),
  hasGaKey: z.boolean().nullable(),
  nickname: z.string().nullable(),
  avatar: z.string().nullable(),
  mobileRegistration: z.boolean().nullable(),
  emailRegistration: z.boolean().nullable(),
  loginId: z.string().nullable(),
  loginName: z.string().nullable(),
})

export const useUserInfo = () => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/user/info'),
      transfer: UserInfoDataSchema.parse,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6ODgwNTQ5NzMxIiwicm5TdHIiOiJhczhrdFZERkRIdGZrNkhMRjhDN3I5N01ndXZoZWkzdyIsImNsaWVudGlkIjoiZGZhNmFhNzRkMGJiMDdmZTQ2OGEwYmY4YTQ1NmM5NjYiLCJ1c2VySWQiOjg4MDU0OTczMX0.L9x41IFM8Hsjz_GwSjfPqboHorSlVbZfHAuc2N7A6UM',
      },
    })
  )
}
