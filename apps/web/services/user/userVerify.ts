import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useLogin } from '@/hooks'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { kycLevelSchema } from '@/types/user'

export const UserVerifyInfoSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    nationality: z.number().nullable(),
    countryCode: z.string().nullable(),
    kycLevel: kycLevelSchema,
    firstName: z.string().nullable(),
    secondName: z.string().nullable(),
    gender: z.number().nullable(),
    cardType: z.number().nullable(),
    cardNo: z.string().nullable(),
    cardNoHash: z.string().nullable(),
    cardFrontUrl: z.string().nullable(),
    cardBackUrl: z.string().nullable(),
    cardHandUrl: z.string().nullable(),
    facePhotoUrl: z.string().nullable(),
    faceVideoUrl: z.string().nullable(),
    videoUrl: z.string().nullable(),
    dataEncrypt: z.boolean(),
    dataSecret: z.string().nullable(),
    passedIdCheck: z.number().nullable(),
    verifyStatus: z.number(),
    created: z.string(),
    updated: z.string(),
    verifyReason: z.string().nullable(),
    fullName: z.string().nullable(),
    submissionTime: z.string().nullable(),
    displayFailedReason: z.string().nullable(),
  })
  .nullable()

export type UserVerifyInfo = z.infer<typeof UserVerifyInfoSchema>

export const useUserVerifyInfo = () => {
  const { isLoggedIn } = useLogin()

  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl('/uc/userVerify/info'),
      transfer: UserVerifyInfoSchema.parse,
    }),
    enabled: isLoggedIn,
  })
}
