import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'

const CountrySchema = z.array(
  z.object({
    id: z.string().nullable(),
    nationalCode: z.string().nullable(),
    domainShortName: z.string().nullable(),
    countryName: z.string().nullable(),
    countryEnName: z.string().nullable(),
    customOrder: z.string().nullable(),
    status: z.number().int().min(0).max(1),
    created: z.string().nullable(),
    flagUrls: z.array(
      z.object({
        url: z.string().url(),
        size: z.string().nullable(),
      })
    ),
    ext: z.object({
      tag: z.string().nullable(),
      desc: z.string().nullable(),
      payload: z.object({
        usage: z.boolean(),
        idCard: z.boolean(),
        passport: z.boolean(),
        driverLicense: z.boolean(),
      }),
      version: z.string().nullable(),
    }),
  })
)

export const getCountrys = () => {
  return getQuery({
    method: 'GET',
    url: getUrl('/baseConfig/allSupportCountry'),
    transfer: CountrySchema.parse,
  })
}
