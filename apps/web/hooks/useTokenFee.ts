import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Token } from '@/services/basicConfig'
import { WithdrawChargeType } from '@/types/token'

export const useTokenFee = (token?: Token, amount?: BigNumber.Value) => {
  const chargeType = token?.tokenSetting?.withdrawChargeType || WithdrawChargeType.fixed
  const chargeValue = token?.tokenSetting?.withdrawChargeValue || 0

  const tokenFee = useMemo(() => {
    if (chargeType === WithdrawChargeType.fixed) {
      return BigNumber(chargeValue).toNumber()
    }

    if (!amount) {
      return 0
    }

    return BigNumber(amount).times(chargeValue).toNumber()
  }, [chargeType, chargeValue, amount])

  return tokenFee
}
