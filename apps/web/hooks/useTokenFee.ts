import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { applyTokenPrecision } from '@/lib/utils'
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

      return applyTokenPrecision(tokenPrecision, BigNumber(amount).times(chargeValue))
    },
    [withdrawChargeType, chargeValue, tokenPrecision, isInternal]
  )

  /**
   * 获取最大提现金额
   */
  const getMaxOrderAmount = useCallback(
    (balance: BigNumber.Value) => {
      if (isInternal) {
        return applyTokenPrecision(tokenPrecision, BigNumber(balance))
      }

      if (withdrawChargeType === WithdrawChargeType.fixed) {
        if (BigNumber(balance).lt(chargeValue)) {
          return 0
        }
        return applyTokenPrecision(tokenPrecision, BigNumber(balance).minus(chargeValue))
      }

      return applyTokenPrecision(tokenPrecision, BigNumber(balance).div(BigNumber(1).plus(chargeValue)))
    },
    [isInternal, withdrawChargeType, tokenPrecision, chargeValue]
  )

  return { getTokenFee, getMaxOrderAmount }
}
