import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

export const GoogleAuthDTOSchema = z.object({
  secretKey: z.string().nullable(),
  qrCodeUrl: z.string().nullable(),
}).nullable()

export const GenerateGoogleAuthResponseSchema = z.object({
  code: z.number().nullable(),
  msg: z.string().nullable(),
  data: GoogleAuthDTOSchema,
})
export type GenerateGoogleAuthResponse = z.infer<typeof GenerateGoogleAuthResponseSchema>

export const useGenerateGoogleAuth = () => {
  return useQuery(
    getQuery({
      method: 'GET',
      url: getUrl('/user/generateGoogleAuth'),
      transfer: GenerateGoogleAuthResponseSchema.parse,
    })
  )
}
