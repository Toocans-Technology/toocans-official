import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { Token } from '@/services/basicConfig'
import { WithdrawChargeType } from '@/types/token'
import { ChargeType } from '@/types/withdraw'
import { useAllToken } from './useAllToken'

export const useTokenFee = (token?: Token, chargeType?: ChargeType) => {
  const { getTokenPrecision } = useAllToken()
  const withdrawChargeType = token?.tokenSetting?.withdrawChargeType || WithdrawChargeType.fixed
  const chargeValue = token?.tokenSetting?.withdrawChargeValue || 0
  const tokenPrecision = getTokenPrecision(token?.tokenId || '')
  const isInternal = chargeType === ChargeType.Internal

  /**
   * 获取提现手续费
   */
  const getTokenFee = useCallback(
    (amount?: BigNumber.Value) => {
      if (isInternal) {
        return 0
      }

      if (withdrawChargeType === WithdrawChargeType.fixed) {
        return BigNumber(chargeValue).toNumber()
      }

      if (!amount) {
        return 0
      }

      return BigNumber(amount)
        .times(chargeValue)
        .toFixed(tokenPrecision?.displayPrecision || 4)
    },
    [withdrawChargeType, chargeValue, tokenPrecision?.displayPrecision, isInternal]
  )

  /**
   * 获取最大提现金额
   */
  const getMaxOrderAmount = useCallback(
    (balance: BigNumber.Value) => {
      if (isInternal) {
        return BigNumber(balance).toFixed(tokenPrecision?.displayPrecision || 4, BigNumber.ROUND_FLOOR)
      }

      if (withdrawChargeType === WithdrawChargeType.fixed) {
        if (BigNumber(balance).lt(chargeValue)) {
          return 0
        }
        return BigNumber(balance)
          .minus(chargeValue)
          .toFixed(tokenPrecision?.displayPrecision || 4, BigNumber.ROUND_FLOOR)
      }

      return BigNumber(balance)
        .div(BigNumber(1).plus(chargeValue))
        .toFixed(tokenPrecision?.displayPrecision || 4, BigNumber.ROUND_FLOOR)
    },
    [withdrawChargeType, chargeValue, tokenPrecision?.displayPrecision, isInternal]
  )

  return { getTokenFee, getMaxOrderAmount }
}
