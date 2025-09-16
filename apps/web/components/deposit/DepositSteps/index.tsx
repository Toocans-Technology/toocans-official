'use client'

import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, toast } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useRedirectIfNotLogin } from '@/hooks'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { getAddress } from '@/services/wallet'
import { AllowDeposit } from '@/types/token'
import RecentDeposits from './RecentDeposits'
import SelectNetwork from './SelectNetwork'
import SelectToken from './SelectToken'

enum DepositStep {
  ChooseToken,
  ChooseNetwork,
  DepositDetails,
}

const DepositSteps: FunctionComponent = () => {
  const { t } = useT('deposit')
  const [step, setStep] = useState(DepositStep.ChooseToken)
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [selectedNetwork, setSelectedNetwork] = useState<Token>()
  const { data: address, error } = getAddress({ tokenId: selectedNetwork?.tokenId })

  useRedirectIfNotLogin()

  const handleCopy = useCallback(() => {
    toast(t('deposit:copySuccess'))
  }, [t])

  const networkList = useMemo(() => {
    if (!selectedToken) {
      return []
    }

    const list = selectedToken.subTokenList.map((item) => ({
      id: item.id,
      name: item.chainName,
      icon: item.chainIcon || '/images/symbol-placeholder.png',
      protocolName: item.protocolName,
      disabled: item.tokenSetting?.allowDeposit === AllowDeposit.disabled,
    }))

    return sortBy(list, ['name'])
  }, [selectedToken])

  const handleSelectToken = useCallback((token: Token) => {
    setSelectedToken(token)
    setSelectedNetwork(undefined)
    setStep(DepositStep.ChooseNetwork)
  }, [])

  const handleSelectNetwork = useCallback(
    (value: string) => {
      const network = selectedToken?.subTokenList.find((item) => item.id === value)

      if (!network) {
        return
      }

      setSelectedNetwork(network)
      setStep(DepositStep.DepositDetails)
    },
    [selectedToken]
  )

  return (
    <>
      <div className="mt-3 w-full rounded-[10px] bg-white p-6">
        <div className="flex max-w-[456px] flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-xs text-white">
                1
              </span>
              <span className="ml-2 text-sm">{t('deposit:chooseToken')}</span>
            </div>
            <SelectToken onSelect={handleSelectToken} popoverClassName="w-[456px]" />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#999] text-xs text-white',
                  step >= DepositStep.ChooseNetwork && 'bg-[#222]'
                )}
              >
                2
              </span>
              <span className={cn('ml-2 text-sm text-[#999]', step >= DepositStep.ChooseNetwork && 'text-[#222]')}>
                {t('deposit:chooseNetwork')}
              </span>
            </div>
            {step >= DepositStep.ChooseNetwork && (
              <SelectNetwork
                value={selectedNetwork?.id || ''}
                networks={networkList}
                onValueChange={handleSelectNetwork}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#999] text-xs text-white',
                  step >= DepositStep.DepositDetails && 'bg-[#222]'
                )}
              >
                3
              </span>
              <span className={cn('ml-2 text-sm text-[#999]', step >= DepositStep.DepositDetails && 'text-[#222]')}>
                {t('deposit:depositDetails')}
              </span>
            </div>
            {step >= DepositStep.DepositDetails && !error && (
              <div className="max-w-[456px]">
                <div className="flex items-center gap-2 rounded bg-[#f8f8f8] p-3">
                  <div className="rounded-md bg-white p-1.5">
                    <QRCodeSVG value={address?.address || ''} size={52} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm text-[#666]">{t('deposit:depositAddress')}</div>
                    <p className="mt-1 break-words text-sm">{address?.address || ''}</p>
                  </div>
                  <CopyToClipboard text={address?.address || ''} onCopy={handleCopy}>
                    <Button variant="ghost" size="icon" rounded="sm">
                      <Image src="/icons/copy.svg" alt="copy" width={16} height={16} />
                    </Button>
                  </CopyToClipboard>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-[#666]">{t('deposit:minDeposit')}</span>
                  <span className="text-[#222]">
                    {selectedNetwork?.tokenSetting?.depositMinQuantity ?? '--'} {selectedToken?.tokenName ?? 'USDT'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RecentDeposits />
    </>
  )
}

export default DepositSteps
