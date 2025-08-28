'use client'

import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useMemo } from 'react'
import { Button, Label } from '@workspace/ui/components'
import { Input } from '@/components/common'
import SelectNetwork from '@/components/deposit/DepositSteps/SelectNetwork'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { AllowWithdraw } from '@/types/token'

interface Props {
  token: Token
  address?: string
  selectedNetwork?: Token
  onSelectNetwork: (value: string) => void
  onAddressChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const OnChain: FunctionComponent<Props> = ({ token, address, selectedNetwork, onSelectNetwork, onAddressChange }) => {
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
        <SelectNetwork value={selectedNetwork?.id || ''} networks={networkList} onValueChange={onSelectNetwork} />
      </div>
      <div className="mt-4 flex max-w-[456px] flex-col gap-2">
        <div className="flex justify-between">
          <Label className="text-sm text-[#222]" htmlFor="withdrawalAddress">
            {t('withdrawal:withdrawalAddress')}
          </Label>
          <Button variant="link" className="text-link hover:text-link/80 text-sm" size="sm">
            {t('withdrawal:manageAddresses')}
          </Button>
        </div>
        <Input
          name="address"
          value={address}
          placeholder={t('withdrawal:withdrawalAddress')}
          onChange={onAddressChange}
          endContent={
            <Button variant="ghost" size="icon" className="size-6" rounded="sm">
              <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
            </Button>
          }
        />
      </div>
    </>
  )
}

export default OnChain
