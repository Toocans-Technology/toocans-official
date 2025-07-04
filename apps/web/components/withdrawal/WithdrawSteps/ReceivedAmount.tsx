import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react'
import { Input, Label } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import WithdrawModal from '../modals/WithdrawModal'

interface Props {
  token?: Token
  address?: string
}

const ReceivedAmount: FunctionComponent<Props> = ({ token, address }) => {
  const { t } = useT('withdrawal')
  const minAmount = token?.tokenSetting?.withdrawMinQuantity || 0
  const [amount, setAmount] = useState<string>('')

  const handleAll = useCallback(() => {}, [])

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }, [])

  return (
    <div className="flex max-w-[456px] flex-col gap-2">
      <Label className="text-sm">{t('withdrawal:receivedAmount')}</Label>
      <div className="focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
        <Input
          value={amount}
          placeholder={`${t('withdrawal:min')} ${minAmount}`}
          className="flex-1 focus-visible:ring-0"
          onChange={handleAmountChange}
        />
        {token && <span className="text-sm">{token?.tokenName}</span>}
        <span className="text-link cursor-pointer text-sm" onClick={handleAll}>
          {t('withdrawal:all')}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:availableBalance')}</span>
        <span>0</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</span>
        <span>0 {token?.tokenName}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:receivedAmount')}</span>
        <span>0 {token?.tokenName}</span>
      </div>
      {token && address && (
        <WithdrawModal token={token} amount={Number(amount)} address={address} accountId={0} tokenFee={0} />
      )}
    </div>
  )
}

export default ReceivedAmount
