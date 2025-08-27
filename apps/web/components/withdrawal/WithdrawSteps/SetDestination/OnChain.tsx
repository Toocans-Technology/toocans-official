'use client'

import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useMemo } from 'react'
import { Button, Input, Label } from '@workspace/ui/components'
import SelectNetwork from '@/components/deposit/DepositSteps/SelectNetwork'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { AllowWithdraw } from '@/types/token'

interface Props {
  token: Token
  address?: string
  selectedNetwork?: Token
  handleSelectNetwork: (value: string) => void
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const OnChain: FunctionComponent<Props> = ({
  token,
  address,
  selectedNetwork,
  handleSelectNetwork,
  handleAddressChange,
}) => {
  const { t } = useT('withdrawal')

  const networkList = useMemo(() => {
    if (!token) {
      return []
    }

    const list = token.subTokenList.map((item) => ({
      id: item.id,
      name: item.chainName,
      icon: item.chainIcon || '/images/symbol-placeholder.png',
      protocolName: item.protocolName,
      disabled: item.tokenSetting?.allowWithdraw === AllowWithdraw.disabled,
    }))

    return sortBy(list, ['name'])
  }, [token])

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-[#222]">{t('withdrawal:onChainType')}</Label>
        <SelectNetwork value={selectedNetwork?.id || ''} networks={networkList} onValueChange={handleSelectNetwork} />
      </div>
      <div className="mt-4 flex max-w-[518px] flex-col gap-2">
        <div className="flex justify-between">
          <Label className="text-sm text-[#222]" htmlFor="withdrawalAddress">
            {t('withdrawal:withdrawalAddress')}
          </Label>
          <Button variant="link" className="text-link hover:text-link/80 text-sm" size="sm">
            {t('withdrawal:manageAddresses')}
          </Button>
        </div>
        <div className="focus-within:border-ring focus-within:ring-brand flex max-w-[518px] items-center gap-4 overflow-hidden rounded bg-[#f8f8f8] pr-3 focus-within:ring-[1px]">
          <Input
            id="withdrawalAddress"
            value={address}
            placeholder={t('withdrawal:withdrawalAddress')}
            className="flex-1 hover:ring-0 focus-visible:ring-0"
            onChange={handleAddressChange}
          />
          <Button variant="ghost" size="icon" className="size-6" rounded="sm">
            <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
          </Button>
        </div>
      </div>
    </>
  )
}

export default OnChain
