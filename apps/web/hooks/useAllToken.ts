import { useCallback } from 'react'
import { getAllToken, AllTokenParams } from '@/services/basicConfig/allToken'

export const useAllToken = (params?: AllTokenParams) => {
  const { data, isLoading, error, refetch } = getAllToken(params)

  const getToken = useCallback(
    (tokenId: string) => {
      return data?.find((token) => token.tokenId === tokenId)
    },
    [data]
  )

  const getTokenPrecision = useCallback(
    (tokenId: string) => {
      const token = getToken(tokenId)
      return token?.tokenSetting?.tokenPrecisionAutoVO
    },
    [getToken]
  )

  return {
    tokens: data,
    isLoading,
    error,
    refetch,
    getToken,
    getTokenPrecision,
  }
}
