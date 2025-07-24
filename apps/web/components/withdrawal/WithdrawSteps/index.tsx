'use client'

import { sortBy } from 'es-toolkit'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Input, Label } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { VerifyModal } from '@/components/common'
import SelectNetwork from '@/components/deposit/DepositSteps/SelectNetwork'
import SelectToken from '@/components/deposit/DepositSteps/SelectToken'
import { useRedirectIfNotLogin } from '@/hooks'
import { useT } from '@/i18n'
import { validateAddress } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { AllowWithdraw } from '@/types/token'
import RecentWithdraw from '../RecentWithdraw'
import ReceivedAmount from './ReceivedAmount'

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
  const [address, setAddress] = useState<string>('')

  useRedirectIfNotLogin()

  const networkList = useMemo(() => {
    if (!selectedToken) {
      return []
    }

    const list = selectedToken.subTokenList.map((item) => ({
      id: item.id,
      name: item.chainName,
      icon: item.chainIcon || '/images/symbol-placeholder.png',
      protocolName: item.protocolName,
      disabled: item.tokenSetting?.allowWithdraw === AllowWithdraw.disabled,
    }))

    return sortBy(list, ['name'])
  }, [selectedToken])

  const handleSelectToken = useCallback((token: Token) => {
    setSelectedToken(token)
    setSelectedNetwork(undefined)
    setStep(WithdrawStep.ChooseNetwork)
    setAddress('')
  }, [])

  const handleSelectNetwork = useCallback(
    (value: string) => {
      const network = selectedToken?.subTokenList.find((item) => item.id === value)

      if (!network) {
        return
      }

      setSelectedNetwork(network)
      setAddress('')

      if (network && address) {
        setStep(WithdrawStep.WithdrawAmount)
      }
    },
    [selectedToken, address]
  )

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      const isValidAddress = validateAddress(value)

      setAddress(value)

      if (selectedNetwork && isValidAddress) {
        setStep(WithdrawStep.WithdrawAmount)
      } else {
        setStep(WithdrawStep.ChooseNetwork)
      }
    },
    [selectedNetwork]
  )

  return (
    <>
      <div className="mt-4 flex w-full flex-col gap-10 rounded-[10px] bg-white p-6">
        <div className="flex flex-col gap-2">
          <div>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-xs text-white">
              1
            </span>
            <span className="ml-2 text-sm">{t('withdrawal:selectToken')}</span>
          </div>
          <SelectToken showAvailable onSelect={handleSelectToken} showDefaultTokens={false} />
        </div>
        <div className="flex flex-col gap-2">
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
          {step >= WithdrawStep.ChooseNetwork && (
            <>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-[#222]">{t('withdrawal:onChainType')}</Label>
                <SelectNetwork
                  value={selectedNetwork?.id || ''}
                  networks={networkList}
                  onValueChange={handleSelectNetwork}
                />
              </div>
              <div className="mt-4 flex max-w-[456px] flex-col gap-2">
                <Label className="text-sm text-[#222]">{t('withdrawal:address')}</Label>
                <Input
                  placeholder={t('withdrawal:addressPlaceholder')}
                  value={address}
                  className="rounded"
                  onChange={handleAddressChange}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
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
            <ReceivedAmount token={selectedToken} network={selectedNetwork} address={address} />
          )}
        </div>
      </div>
      <RecentWithdraw />
      <VerifyModal />
    </>
  )
}

export default WithdrawSteps
