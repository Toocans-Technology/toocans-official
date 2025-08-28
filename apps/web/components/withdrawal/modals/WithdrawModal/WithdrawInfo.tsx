import { FunctionComponent } from 'react'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { User } from '@/services/wallet/searchUser'
import { ChargeType } from '@/types/withdraw'

interface Props {
  token?: Token
  address?: string
  amount?: number
  tokenFee?: string | number
  userInfo?: User
  chargeType?: ChargeType
}

const WithdrawInfo: FunctionComponent<Props> = ({ token, address, amount, tokenFee, userInfo, chargeType }) => {
  const { t } = useT('withdrawal')

  return (
    <>
      {chargeType === ChargeType.OnChain && (
        <div className="grid gap-2">
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:network')}</div>
            <div className="text-right font-medium">
              {token?.protocolName ? `${token?.chainName}(${token?.protocolName})` : (token?.chainName ?? '-')}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:address')}</div>
            <div className="overflow-hidden break-words text-right font-medium">{address || '-'}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:withdrawAmount')}</div>
            <div className="text-right font-medium">
              {amount || 0} {token?.tokenName || ''}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</div>
            <div className="text-right font-medium">
              {tokenFee || 0} {token?.tokenName || ''}
            </div>
          </div>
        </div>
      )}
      {chargeType === ChargeType.Internal && (
        <div className="grid gap-2">
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:uid')}</div>
            <div className="overflow-hidden break-words text-right font-medium">{userInfo?.uid || '-'}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:nickname')}</div>
            <div className="overflow-hidden break-words text-right font-medium">{userInfo?.nickName || '-'}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default WithdrawInfo
