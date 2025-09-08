import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getMutation } from '@/lib/api'
import { getUrlByMarket } from '@/lib/api/getUrl'

const HourlyMarketPriceResponseSchema = z.record(
  z.string(),
  z.array(
    z.object({
      symbol: z.string(),
      timestamp: z.number(),
      lastPrice: z.number(),
      openPrice: z.number(),
    })
  )
)
export type HourlyMarketPriceResponse = z.infer<typeof HourlyMarketPriceResponseSchema>
export const useHourlyMarketPrice = () => {
  return useMutation(
    getMutation(() => ({
      method: 'GET',
      url: getUrlByMarket('/quotation/market-price/allsymbols-hourly'),
      transfer: HourlyMarketPriceResponseSchema.parse,
    }))
  )
}
