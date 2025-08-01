import { BalanceRecordParams, useBalanceRecord } from '@/services/asset/useBalanceRecord'
import { useGetAllAsset } from '@/services/asset/useGetAllAsset'

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
