import { getAllToken, AllTokenParams } from '@/services/basicConfig/allToken'

export const useAllToken = (params?: AllTokenParams) => {
  const { data, isLoading, error, refetch } = getAllToken(params)

  return {
    tokens: data,
    isLoading,
    error,
    refetch,
  }
}
