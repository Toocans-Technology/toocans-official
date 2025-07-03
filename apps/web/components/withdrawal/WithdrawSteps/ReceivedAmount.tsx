import { FunctionComponent, useCallback } from 'react'
import { Input } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'

interface Props {
  token?: Token
  minAmount?: string
  onChange?: (value: string) => void
}

const ReceivedAmount: FunctionComponent<Props> = ({ token, minAmount = 0, onChange }) => {
  const { t } = useT('withdrawal')

  const handleAll = useCallback(() => {}, [])

  return (
    <div className="flex max-w-[456px] flex-col gap-2">
      <div className="text-sm text-[#222]">{t('withdrawal:receivedAmount')}</div>
      <div className="focus-within:border-ring focus-within:ring-primary flex items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-4 focus-within:ring-[1px]">
        <Input
          placeholder={`${t('withdrawal:min')} ${minAmount}`}
          className="flex-1 focus-visible:ring-0"
          onChange={(e) => onChange?.(e.target.value)}
        />
        {token && <span className="text-sm">{token?.tokenName}</span>}
        <span className="text-link cursor-pointer text-sm" onClick={handleAll}>
          {t('withdrawal:all')}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:availableBalance')}</span>
        <span className="text-[#222]">0</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</span>
        <span className="text-[#222]">0 {token?.tokenName}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#999]">{t('withdrawal:receivedAmount')}</span>
        <span className="text-[#222]">0 {token?.tokenName}</span>
      </div>
    </div>
  )
}

export default ReceivedAmount
