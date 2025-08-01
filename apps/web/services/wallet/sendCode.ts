import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { verifyTypeSchema } from '@/types/withdraw'

const CodeResSchema = z.object({}).nullable()

export type CodeRes = z.infer<typeof CodeResSchema>

const CodeParamsSchema = z
  .object({
    type: verifyTypeSchema,
  })
  .optional()

export type CodeParams = z.infer<typeof CodeParamsSchema>

export const useSendCode = () => {
  return useMutation(
    getMutation((params: CodeParams) => ({
      method: 'GET',
      url: getUrl('/dw/withdraw/sendCode'),
      query: CodeParamsSchema.parse(params),
      transfer: CodeResSchema.parse,
    }))
  )
}
