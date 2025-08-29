import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getQuery } from '@/lib/api'
import { getUrlByMarket } from '@/lib/api/getUrl'

const HistoryMarketPriceSchema = z.object({
  symbol: z.string(),
  timestamp: z.number(),
  lastPrice: z.number(),
  openPrice: z.number(),
  highPrice: z.number(),
  lowPrice: z.number(),
  volume: z.number(),
  priceChange: z.number(),
  priceChangePercent: z.number(),
})

const LiveMarketPriceSchema = z.object({
  symbol: z.string(),
  liveMarketPrice: z.number(),
  liveMarketPriceChange: z.number(),
})

const HourlyMarketPriceDataSchema = z.object({
  historyMarketPrices: z.array(HistoryMarketPriceSchema),
  liveMarketPrice: LiveMarketPriceSchema,
})

const HourlyMarketPriceResponseSchema = z.object({
  data: HourlyMarketPriceDataSchema,
})

export type HistoryMarketPrice = z.infer<typeof HistoryMarketPriceSchema>
export type LiveMarketPrice = z.infer<typeof LiveMarketPriceSchema>
export type HourlyMarketPriceData = z.infer<typeof HourlyMarketPriceDataSchema>
export type HourlyMarketPriceResponse = z.infer<typeof HourlyMarketPriceResponseSchema>

export const useHourlyMarketPrice = (symbol: string) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrlByMarket('/quotation/market-price/hourly'),
      query: { symbol },
      transfer: HourlyMarketPriceResponseSchema.parse,
    }),
    enabled: !!symbol,
  })
}
