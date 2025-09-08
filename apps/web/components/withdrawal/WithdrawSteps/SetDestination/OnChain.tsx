'use client'

import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Label } from '@workspace/ui/components'
import { InputWithTag, Link } from '@/components/common'
import SelectNetwork from '@/components/deposit/DepositSteps/SelectNetwork'
import { useT } from '@/i18n'
import { PATHNAMES } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { AllowWithdraw } from '@/types/token'
import { AddressType } from '@/types/withdraw'
import { SelectAddressModal } from '../../modals'

interface Props {
  token: Token
  address?: string
  selectedNetwork?: Token
  onSelectNetwork: (value: string) => void
  onSelectAddress?: (address?: WithdrawAddress) => void
  onAddressChange: (value: string, network?: Token) => void
}

const OnChain: FunctionComponent<Props> = ({
  token,
  address,
  selectedNetwork,
  onSelectNetwork,
  onAddressChange,
  onSelectAddress,
}) => {
  const { t } = useT('withdrawal')
  const [open, setOpen] = useState(false)
  const ref = useRef<string>(token.tokenId)
  const [selectedAddress, setSelectedAddress] = useState<WithdrawAddress>()

  const networkList = useMemo(() => {
    if (!token) {
      return []
    }

    const list = token.subTokenList.map((item) => ({
      id: item.chainTokenId,
      name: item.chainName,
      icon: item.chainIcon || '/images/symbol-placeholder.png',
      protocolName: item.protocolName,
      disabled: item.tokenSetting?.allowWithdraw === AllowWithdraw.disabled,
    }))

    return sortBy(list, ['name'])
  }, [token])

  const handleClearAddress = useCallback(() => {
    setSelectedAddress(undefined)
    onAddressChange?.('')
    onSelectAddress?.(undefined)
  }, [onAddressChange, onSelectAddress])

  useEffect(() => {
    if (ref.current !== token.tokenId) {
      handleClearAddress()
      ref.current = token.tokenId
    }
  }, [token, handleClearAddress, selectedNetwork])

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleClearAddress()
      onAddressChange?.(e.target.value)
    },
    [onAddressChange, handleClearAddress]
  )

  const handleSelectNetwork = useCallback(
    (value: string) => {
      onSelectNetwork(value)
      handleClearAddress()
    },
    [onSelectNetwork, handleClearAddress]
  )

  const handleConfirm = useCallback(
    (address?: WithdrawAddress) => {
      setSelectedAddress(address)

      if (address?.tokenNetWork) {
        const network = token?.subTokenList.find((item) => item.chainTokenId === address?.tokenNetWork)

        if (network && network.tokenSetting?.allowWithdraw === AllowWithdraw.enabled) {
          onSelectNetwork(network.chainTokenId)
          onAddressChange?.(address?.address || '', network)
        } else {
          onSelectNetwork('')
          onAddressChange?.('')
        }
      }
    },
    [onAddressChange, onSelectNetwork, token?.subTokenList]
  )

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-[#222]">{t('withdrawal:onChainType')}</Label>
        <SelectNetwork
          value={selectedNetwork?.chainTokenId || ''}
          networks={networkList}
          onValueChange={handleSelectNetwork}
        />
        {/* {selectedAddress && selectedNetwork && selectedNetwork?.chainTokenId !== selectedAddress.tokenNetWork && (
          <div className="bg-warning rounded-md px-3 py-2 text-sm">{t('withdrawal:networkChangeWarning')}</div>
        )} */}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <Label className="text-sm text-[#222]" htmlFor="withdrawalAddress">
            {t('withdrawal:withdrawalAddress')}
          </Label>
          <Link href={PATHNAMES.withdrawAddress} className="text-link hover:text-link/80 text-sm">
            {t('withdrawal:manageAddresses')}
          </Link>
        </div>
        <InputWithTag
          value={address}
          onChange={handleAddressChange}
          tag={selectedAddress?.addressName}
          placeholder={t('withdrawal:withdrawalAddress')}
          showClear={!!address || !!selectedAddress}
          endContent={
            <Button variant="ghost" size="icon" className="size-6" rounded="sm" onClick={() => setOpen(true)}>
              <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
            </Button>
          }
        />
      </div>
      <SelectAddressModal
        open={open}
        token={token}
        value={selectedAddress?.id}
        addressTypes={[AddressType.OnChain]}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default OnChain
