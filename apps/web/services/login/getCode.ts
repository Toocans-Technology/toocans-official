import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const GetCodeReqParams = z
  .object({
    email: z.string().optional(),
    nationalCode: z.string().optional(),
    mobile: z.string().optional(),
  })
  .optional()

const ResponseSchema = z.object({ code: z.string() })

export type CodeParams = z.infer<typeof GetCodeReqParams>

export const useCodeByEmail = (params?: z.infer<typeof GetCodeReqParams>) => {
  return getQuery({
    method: 'GET',
    url: getUrl('/resource/email/code'),
    query: GetCodeReqParams.parse(params),
    transfer: ResponseSchema.parse,
  })
}

export const useCodeByMobile = (params?: z.infer<typeof GetCodeReqParams>) => {
  return getQuery({
    method: 'GET',
    url: getUrl('/resource/email/code'),
    query: GetCodeReqParams.parse(params),
    transfer: ResponseSchema.parse,
  })
}
