import { FunctionComponent, useMemo } from 'react'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { ExtendedUser } from '@/services/wallet/searchUser'
import { ChargeType, InternalTransferType } from '@/types/withdraw'

interface Props {
  token?: Token
  address?: string
  amount?: number
  tokenFee?: string | number
  userInfo?: ExtendedUser
  chargeType?: ChargeType
  transferType?: InternalTransferType
}

const WithdrawInfo: FunctionComponent<Props> = ({
  token,
  address,
  amount,
  tokenFee,
  userInfo,
  chargeType,
  transferType,
}) => {
  const { t } = useT('withdrawal')

  const transferTypeLabel = useMemo(() => {
    if (transferType === InternalTransferType.UID) {
      return t('withdrawal:uid')
    } else if (transferType === InternalTransferType.Email) {
      return t('withdrawal:email')
    } else {
      return t('withdrawal:phone')
    }
  }, [transferType, t])

  const userInfoItem = useMemo(() => {
    if (transferType === InternalTransferType.UID) {
      return userInfo?.uid
    } else if (transferType === InternalTransferType.Email) {
      return userInfo?.email
    } else {
      return userInfo?.phone
    }
  }, [transferType, userInfo])

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
        <>
          <div className="flex flex-col items-center gap-3 text-sm">
            <div className="text-[#666]">{t('withdrawal:receivedAmount')}</div>
            <div className="flex items-center text-right font-medium">
              <span className="text-2xl">
                {amount} {token?.tokenName}
              </span>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <div className="grid grid-cols-2 items-center py-1.5 text-sm">
              <div className="text-[#999]">{transferTypeLabel}</div>
              <div className="overflow-hidden break-words text-right font-medium">{userInfoItem || '-'}</div>
            </div>
            <div className="grid grid-cols-2 items-center py-1.5 text-sm">
              <div className="text-[#999]">{t('withdrawal:nickname')}</div>
              <div className="overflow-hidden break-words text-right font-medium">{userInfo?.nickName || '-'}</div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default WithdrawInfo
