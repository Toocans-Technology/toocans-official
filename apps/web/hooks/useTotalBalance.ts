import BigNumber from 'bignumber.js'
import { sumBy } from 'es-toolkit'
import { useMemo } from 'react'
import { GetAllAssetResponse } from '@/services/asset/useGetAllAsset'
import { useAssetAll } from './asset'
import { useAllToken } from './useAllToken'

export const useTotalBalance = () => {
  const { data: data } = useAssetAll()
  const { tokens: allTokenData } = useAllToken()

  const total = useMemo(() => {
    if (!Array.isArray(data) || !Array.isArray(allTokenData)) return 0

    return sumBy(
      (data as GetAllAssetResponse).filter((item) => allTokenData.some((token) => token.tokenId === item.tokenId)),
      (item) => {
        const total = new BigNumber(item.total ?? 0)
        const price = item.tokenId === 'USDT' ? new BigNumber(1) : new BigNumber(item.marketPrice ?? 0)
        return total.multipliedBy(price).toNumber()
      }
    )
  }, [data, allTokenData])

  return { totalBalance: total }
}
