import { useBalanceRecord, useGetAllAsset, BalanceRecordParams, useAllToken as useAllTokenApi } from '@/services/asset/asset'

export const useAssetRecord = (params: BalanceRecordParams) => {
  const { data, isLoading, error, refetch } = useBalanceRecord(params)
  return {
    records: data,
    isLoading,
    error,
    refetch,
  }
}

export const useAssetAll = (tokenId?: string) => {
  const { data, isLoading, error, refetch } = useGetAllAsset(tokenId ? { tokenId } : undefined)
  return {
    data,
    isLoading,
    error,
    refetch,
  }
}

export const useAllToken = (tokenId?: string) => {
  const { data, isLoading, error, refetch } = useAllTokenApi(tokenId)
  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
