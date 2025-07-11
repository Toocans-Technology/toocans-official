import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export * from './getCode'
export * from './getCountrys'

const LoginReqParams = z.object({
  clientId: z.string(),
  grantType: z.enum(['email', 'sms', 'password']).optional(),
  code: z.nullable(z.string()),
  uuid: z.nullable(z.string()),
  channel: z.nullable(z.string()),
  source: z.nullable(z.string()),
  inputInviteCode: z.nullable(z.string()),
  appInfo: z.nullable(z.string()),
  email: z.string().optional(),
  emailCode: z.string().optional(),
  nationalCode: z.string().optional(),
  phonenumber: z.string().optional(),
  smsCode: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
})

export const useLogin = () => {
  return useMutation(
    getMutation((params: z.infer<typeof LoginReqParams>) => ({
      method: 'POST',
      url: getUrl('/auth/login'),
      body: LoginReqParams.parse(params),
      transfer: (data) => data,
    }))
  )
}

const SetPasswordReqParams = z.object({ password: z.string() })

export const useSetPassword = () => {
  return useMutation(
    getMutation((params: z.infer<typeof SetPasswordReqParams>) => ({
      method: 'POST',
      url: getUrl('/user/addPassword'),
      body: SetPasswordReqParams.parse(params),
      transfer: (data) => data,
    }))
  )
}
