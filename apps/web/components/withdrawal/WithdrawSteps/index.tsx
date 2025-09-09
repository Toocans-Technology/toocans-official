'use client'

import { FunctionComponent, useCallback, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import SelectToken from '@/components/deposit/DepositSteps/SelectToken'
import { useRedirectIfNotLogin } from '@/hooks'
import { useT } from '@/i18n'
import { validateAddress } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { User } from '@/services/wallet/searchUser'
import { ChargeType, InternalTransferType } from '@/types/withdraw'
import RecentWithdraw from '../RecentWithdraw'
import ReceivedAmount from './ReceivedAmount'
import SetDestination from './SetDestination'

enum WithdrawStep {
  ChooseToken,
  ChooseNetwork,
  WithdrawAmount,
}

const WithdrawSteps: FunctionComponent = () => {
  const { t } = useT(['withdrawal', 'common'])
  const [step, setStep] = useState(WithdrawStep.ChooseToken)
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [selectedNetwork, setSelectedNetwork] = useState<Token>()
  const [chargeType, setChargeType] = useState<ChargeType>(ChargeType.OnChain)
  const [address, setAddress] = useState<string>('')
  const [targetUser, setTargetUser] = useState<User>()
  const [transferType, setTransferType] = useState<InternalTransferType>(InternalTransferType.Email)

  useRedirectIfNotLogin()

  const handleSelectToken = useCallback((token: Token) => {
    setSelectedToken(token)
    setSelectedNetwork(undefined)
    setStep(WithdrawStep.ChooseNetwork)
    setAddress('')
  }, [])

  const handleSelectNetwork = useCallback(
    (value: string) => {
      const network = selectedToken?.subTokenList.find((item) => item.chainTokenId === value)

      if (!network) {
        return
      }

      setSelectedNetwork(network)

      if (network && address) {
        setStep(WithdrawStep.WithdrawAmount)
      }
    },
    [selectedToken, address]
  )

  const handleAddressChange = useCallback(
    (value: string, network?: Token) => {
      const isValidAddress = validateAddress(value)

      setAddress(value)

      if ((selectedNetwork || network) && isValidAddress) {
        setStep(WithdrawStep.WithdrawAmount)
      } else {
        setStep(WithdrawStep.ChooseNetwork)
      }
    },
    [selectedNetwork]
  )

  const handleTabChange = useCallback((value: string) => {
    setAddress('')
    setSelectedNetwork(undefined)
    setChargeType(Number(value) as ChargeType)
    setStep(WithdrawStep.ChooseNetwork)
  }, [])

  const handleInternalTransferChange = useCallback(
    (data?: User) => {
      if (data) {
        setAddress(data.uid)
        setTargetUser(data)
        setStep(WithdrawStep.WithdrawAmount)
      } else {
        setAddress('')
        setTargetUser(undefined)
        setStep(WithdrawStep.ChooseNetwork)
      }
    },
    [setStep, setAddress]
  )

  return (
    <>
      <div className="mt-3 flex w-full flex-col gap-10 rounded-[10px] bg-white p-6">
        <div className="flex max-w-[456px] flex-col gap-2">
          <div>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-xs text-white">
              1
            </span>
            <span className="ml-2 text-sm">{t('withdrawal:selectToken')}</span>
          </div>
          <SelectToken
            showAvailable
            onSelect={handleSelectToken}
            showDefaultTokens={false}
            popoverClassName="w-[456px]"
          />
        </div>
        <div className="flex max-w-[456px] flex-col gap-2">
          <div>
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#999] text-xs text-white',
                step >= WithdrawStep.ChooseNetwork && 'bg-[#222]'
              )}
            >
              2
            </span>
            <span className={cn('ml-2 text-sm text-[#999]', step >= WithdrawStep.ChooseNetwork && 'text-[#222]')}>
              {t('withdrawal:setDestination')}
            </span>
          </div>
          {step >= WithdrawStep.ChooseNetwork && selectedToken && (
            <SetDestination
              address={address}
              token={selectedToken}
              chargeType={chargeType}
              selectedNetwork={selectedNetwork}
              onTabChange={handleTabChange}
              onSelectNetwork={handleSelectNetwork}
              onAddressChange={handleAddressChange}
              onTransferTabChange={setTransferType}
              onInternalTransferChange={handleInternalTransferChange}
            />
          )}
        </div>
        <div className="flex max-w-[456px] flex-col gap-2">
          <div>
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#999] text-xs text-white',
                step >= WithdrawStep.WithdrawAmount && 'bg-[#222]'
              )}
            >
              3
            </span>
            <span className={cn('ml-2 text-sm text-[#999]', step >= WithdrawStep.WithdrawAmount && 'text-[#222]')}>
              {t('withdrawal:setAmount')}
            </span>
          </div>
          {step >= WithdrawStep.WithdrawAmount && (
            <ReceivedAmount
              token={selectedToken}
              network={selectedNetwork}
              address={address}
              chargeType={chargeType}
              targetUser={targetUser}
              transferType={transferType}
            />
          )}
        </div>
      </div>
      <RecentWithdraw />
    </>
  )
}

export default WithdrawSteps
