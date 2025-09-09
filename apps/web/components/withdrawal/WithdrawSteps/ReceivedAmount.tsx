import BigNumber from 'bignumber.js'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Input, Label } from '@workspace/ui/components'
import { useAssetAll } from '@/hooks/asset'
import { useTokenFee } from '@/hooks/useTokenFee'
import { useT } from '@/i18n'
import { formatInputAmount } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { Withdrawal } from '@/services/wallet'
import { User } from '@/services/wallet/searchUser'
import { InputValueType } from '@/types/form'
import { ChargeType, InternalTransferType } from '@/types/withdraw'
import { WithdrawDetailModal } from '../modals'
import WithdrawModal from '../modals/WithdrawModal'

interface Props {
  token?: Token
  network?: Token
  address?: string
  targetUser?: User
  chargeType?: ChargeType
  transferType?: InternalTransferType
}

const ReceivedAmount: FunctionComponent<Props> = ({
  token,
  network,
  address,
  chargeType,
  transferType,
  targetUser,
}) => {
  const { t } = useT('withdrawal')
  const minAmount = network?.tokenSetting?.withdrawMinQuantity || 0
  const { data } = useAssetAll(token?.tokenId)
  const [transferId, setTransferId] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<InputValueType>({ value: '', error: '', isInvalid: false })
  const { getTokenFee, getMaxOrderAmount } = useTokenFee(network, chargeType)
  const tokenFee = useMemo(() => getTokenFee(amount.value), [getTokenFee, amount.value])
  const isOnChain = chargeType === ChargeType.OnChain

  const userAsset = useMemo(() => {
    if (!data?.length) {
      return null
    }
    return data[0]
  }, [data])

  const disabled = useMemo(() => {
    if (amount.isInvalid || !amount.value) {
      return true
    }
    return false
  }, [amount])

  const withdrawAmount = useMemo(() => {
    if (!userAsset || !amount.value) {
      return 0
    }
    return BigNumber(amount.value).plus(tokenFee).toNumber()
  }, [userAsset, amount, tokenFee])

  const validateAmount = useCallback(
    (value: string, availableBalance: string | number = userAsset?.available || 0) => {
      const tokenFee = getTokenFee(value)

      if (BigNumber(value).lt(minAmount)) {
        return {
          value,
          error: t('withdrawal:amountError.minAmount', { minAmount }),
          isInvalid: true,
        }
      }

      if (BigNumber(value).gt(BigNumber(availableBalance).minus(tokenFee))) {
        return {
          value,
          error: t('withdrawal:amountError.insufficientBalance', { maxAmount: availableBalance }),
          isInvalid: true,
        }
      }

      return { value, error: '', isInvalid: false }
    },
    [getTokenFee, minAmount, t, userAsset?.available]
  )

  const handleAll = useCallback(() => {
    const maxAmount = getMaxOrderAmount(userAsset?.available || 0)
    const validatedAmount = validateAmount(maxAmount.toString())
    setAmount(validatedAmount)
  }, [getMaxOrderAmount, userAsset?.available, validateAmount])

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = formatInputAmount(e.target.value, token?.minPrecision)
      const newAmount = validateAmount(value)
      setAmount(newAmount)
    },
    [token?.minPrecision, validateAmount]
  )

  const handleOpenDetail = useCallback((open: boolean, data: Withdrawal) => {
    setOpen(open)
    setTransferId(data.id)
  }, [])

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="text-sm">{t('withdrawal:receivedAmount')}</Label>
        <div className="focus-within:border-ring focus-within:ring-brand flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
          <Input
            value={amount.value}
            placeholder={`${t('withdrawal:min')} ${minAmount}`}
            className="flex-1 hover:ring-0 focus-visible:ring-0"
            onChange={handleAmountChange}
          />
          {token && <span className="text-sm">{token?.tokenName}</span>}
          <span className="text-link cursor-pointer text-sm" onClick={handleAll}>
            {t('withdrawal:all')}
          </span>
        </div>
        {amount.isInvalid && <p className="text-destructive text-xs">{amount.error}</p>}
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:availableBalance')}</span>
        <span>{userAsset?.available ?? 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</span>
        <span>{isOnChain ? `${tokenFee} ${token?.tokenName}` : t('withdrawal:free')}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:withdrawAmount')}</span>
        <span>
          {withdrawAmount} {token?.tokenName}
        </span>
      </div>
      {address && token && (
        <WithdrawModal
          token={network || token}
          address={address}
          disabled={disabled}
          tokenFee={tokenFee}
          targetUser={targetUser}
          chargeType={chargeType}
          amount={withdrawAmount}
          transferType={transferType}
          openDetail={handleOpenDetail}
        />
      )}
      {token && <WithdrawDetailModal id={transferId} onOpenChange={setOpen} open={open} />}
    </div>
  )
}

export default ReceivedAmount
