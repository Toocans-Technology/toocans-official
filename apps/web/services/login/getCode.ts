import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const GetCodeReqParams = z
  .object({
    email: z.string().optional(),
    nationalCode: z.string().optional(),
    mobile: z.string().optional(),
  })
  .optional()

const ResponseSchema = z.object({ code: z.string() }).nullable()

export type CodeParams = z.infer<typeof GetCodeReqParams>

export const useCodeByEmail = () => {
  return useMutation(
    getMutation((params: z.infer<typeof GetCodeReqParams>) => ({
      method: 'GET',
      url: getUrl('/resource/email/code'),
      query: GetCodeReqParams.parse(params),
      transfer: ResponseSchema.parse,
    }))
  )
}

export const useCodeByMobile = () => {
  return useMutation(
    getMutation((params: z.infer<typeof GetCodeReqParams>) => ({
      method: 'GET',
      url: getUrl('/resource/sms/code'),
      query: GetCodeReqParams.parse(params),
      transfer: ResponseSchema.parse,
    }))
  )
}
