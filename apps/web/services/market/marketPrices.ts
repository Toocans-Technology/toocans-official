import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrlByV2 } from '@/lib/api/getUrl'

export const RulePairInfoSchema = z.object({
  ruleName: z.string().nullable(),
  roundMode: z.number().nullable().optional(),
  padWithZeros: z.number().nullable().optional(),
  displayPrecision: z.number().nullable().optional(),
})

export const MarketPriceItemSchema = z
  .object({
    id: z.string().nullable(),
    displaySymbol: z.string().nullable(),
    baseToken: z.string().nullable(),
    quoteToken: z.string().nullable(),
    cexName: z.string().nullable(),
    channelIndex: z.string().nullable(),
    rulePairInfo: RulePairInfoSchema.nullable(),
    state: z.number().nullable().optional(),
    sort: z.string().nullable().optional(),
    marketPrice: z.string().nullable().optional(),
    marketPriceChange: z.string().nullable().optional(),
  })
  .array()
  .nullable()

export type MarketPricesResponse = z.infer<typeof MarketPriceItemSchema>

export const useMarketPrices = () => {
  return useMutation(
    getMutation(() => ({
      method: 'POST',
      url: getUrlByV2('/mk/market/market-prices'),
      body: {},
      transfer: MarketPriceItemSchema.parse,
    }))
  )
}
