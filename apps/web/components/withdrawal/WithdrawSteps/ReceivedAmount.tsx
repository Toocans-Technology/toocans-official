import BigNumber from 'bignumber.js'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Input, Label } from '@workspace/ui/components'
import { useAssetAll } from '@/hooks/asset'
import { useTokenFee } from '@/hooks/useTokenFee'
import { useT } from '@/i18n'
import { formatInputAmount } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { WithdrawRes } from '@/services/wallet'
import { WithdrawDetailModal } from '../modals'
import WithdrawModal from '../modals/WithdrawModal'

type InputValueType = {
  value: string
  error: string
  isInvalid: boolean
}

interface Props {
  token?: Token
  address?: string
}

const ReceivedAmount: FunctionComponent<Props> = ({ token, address }) => {
  const { t } = useT('withdrawal')
  const minAmount = token?.tokenSetting?.withdrawMinQuantity || 0
  const [transferId, setTransferId] = useState<number | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<InputValueType>({ value: '', error: '', isInvalid: false })
  const tokenFee = useTokenFee(token, Number(amount.value))
  const { data } = useAssetAll(token?.tokenId)

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

  const receivedAmount = useMemo(() => {
    if (!userAsset) {
      return 0
    }
    return amount.value ?? 0
  }, [userAsset, amount])

  const handleAll = useCallback(() => {
    const allAmount = BigNumber(userAsset?.available || 0).minus(tokenFee)
    setAmount({ value: allAmount.toString(), error: '', isInvalid: false })
  }, [userAsset, tokenFee])

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = formatInputAmount(e.target.value)

      if (BigNumber(value).lt(minAmount)) {
        setAmount({ value, error: t('withdrawal:amountError.minAmount', { minAmount }), isInvalid: true })
        return
      } else if (BigNumber(value).gt(BigNumber(userAsset?.available || 0).minus(tokenFee))) {
        setAmount({
          value,
          error: t('withdrawal:amountError.insufficientBalance', { maxAmount: userAsset?.available }),
          isInvalid: true,
        })
        return
      } else {
        setAmount({ value, error: '', isInvalid: false })
      }
    },
    [userAsset, minAmount, tokenFee]
  )

  const handleOpenDetail = useCallback((open: boolean, data: WithdrawRes) => {
    setOpen(open)
    setTransferId(data.id)
  }, [])

  return (
    <div className="flex max-w-[456px] flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="text-sm">{t('withdrawal:receivedAmount')}</Label>
        <div className="focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
          <Input
            value={amount.value}
            placeholder={`${t('withdrawal:min')} ${minAmount}`}
            className="flex-1 focus-visible:ring-0"
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
        <span>
          {tokenFee} {token?.tokenName}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:receivedAmount')}</span>
        <span>
          {receivedAmount} {token?.tokenName}
        </span>
      </div>
      {token && address && (
        <WithdrawModal
          token={token}
          amount={Number(amount.value)}
          address={address}
          accountId={0}
          disabled={disabled}
          tokenFee={tokenFee}
          openDetail={handleOpenDetail}
        />
      )}
      {token && <WithdrawDetailModal id={transferId} onOpenChange={setOpen} open={open} />}
    </div>
  )
}

export default ReceivedAmount
