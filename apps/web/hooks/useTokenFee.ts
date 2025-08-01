import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { Token } from '@/services/basicConfig'
import { WithdrawChargeType } from '@/types/token'

export const useTokenFee = (token?: Token) => {
  const chargeType = token?.tokenSetting?.withdrawChargeType || WithdrawChargeType.fixed
  const chargeValue = token?.tokenSetting?.withdrawChargeValue || 0

  /**
   * 获取提现手续费
   */
  const getTokenFee = useCallback(
    (amount: BigNumber.Value) => {
      if (chargeType === WithdrawChargeType.fixed) {
        return BigNumber(chargeValue).toNumber()
      }

      if (!amount) {
        return 0
      }

      return BigNumber(amount)
        .times(chargeValue)
        .toFixed(token?.minPrecision || 4)
    },
    [chargeType, chargeValue]
  )

  /**
   * 获取最大提现金额
   */
  const getMaxOrderAmount = useCallback(
    (balance: BigNumber.Value) => {
      if (chargeType === WithdrawChargeType.fixed) {
        if (BigNumber(balance).lt(chargeValue)) {
          return 0
        }
        return BigNumber(balance)
          .minus(chargeValue)
          .toFixed(token?.minPrecision || 4, BigNumber.ROUND_FLOOR)
      }

      return BigNumber(balance)
        .div(BigNumber(1).plus(chargeValue))
        .toFixed(token?.minPrecision || 4, BigNumber.ROUND_FLOOR)
    },
    [chargeType, chargeValue]
  )

  return { getTokenFee, getMaxOrderAmount }
}
