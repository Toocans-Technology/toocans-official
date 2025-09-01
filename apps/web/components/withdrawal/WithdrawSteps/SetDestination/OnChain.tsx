'use client'

import { sortBy } from 'es-toolkit'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Button, Input, Label } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { Link } from '@/components/common'
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
  onAddressChange: (value: string) => void
  onSelectAddress?: (address?: WithdrawAddress) => void
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
  const [selectedAddress, setSelectedAddress] = useState<WithdrawAddress>()

  const networkList = useMemo(() => {
    if (!token) {
      return []
    }

    const list = token.subTokenList.map((item) => ({
      id: item.tokenId,
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

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleClearAddress()
      onAddressChange?.(e.target.value)
    },
    [onAddressChange, handleClearAddress]
  )

  const handleConfirm = useCallback(
    (address?: WithdrawAddress) => {
      setSelectedAddress(address)
      onSelectAddress?.(address)
      onAddressChange?.(address?.address || '')
    },
    [onAddressChange, onSelectAddress]
  )

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-[#222]">{t('withdrawal:onChainType')}</Label>
        <SelectNetwork value={selectedNetwork?.tokenId || ''} networks={networkList} onValueChange={onSelectNetwork} />
        {selectedAddress && selectedNetwork && selectedNetwork?.chainTokenId !== selectedAddress.tokenNetWork && (
          <div className="bg-warning max-w-[456px] rounded-md px-3 py-2 text-sm">
            {t('withdrawal:networkChangeWarning')}
          </div>
        )}
      </div>
      <div className="mt-4 flex max-w-[456px] flex-col gap-2">
        <div className="flex justify-between">
          <Label className="text-sm text-[#222]" htmlFor="withdrawalAddress">
            {t('withdrawal:withdrawalAddress')}
          </Label>
          <Link href={PATHNAMES.withdrawAddress} className="text-link hover:text-link/80 text-sm">
            {t('withdrawal:manageAddresses')}
          </Link>
        </div>
        <div
          aria-invalid={false}
          className="hover:border-ring hover:ring-brand aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-2 overflow-hidden rounded-md bg-[#f8f8f8] px-3 py-1 hover:ring-[1px]"
        >
          <div className="flex flex-1 flex-col items-start">
            {selectedAddress && (
              <span className="text-brand border-brand inline-flex rounded border border-solid px-2 text-[10px]">
                {selectedAddress.addressName}
              </span>
            )}
            <Input
              autoComplete="off"
              className={cn('aria-invalid:ring-0 h-9 p-0 hover:ring-0 focus-visible:ring-0', selectedAddress && 'h-8')}
              value={address}
              placeholder={t('withdrawal:withdrawalAddress')}
              onChange={handleAddressChange}
            />
          </div>
          {(address || selectedAddress) && (
            <span
              className="inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-[#666] hover:bg-[#999]"
              onClick={handleClearAddress}
            >
              <XIcon color="#fff" size={12} />
            </span>
          )}
          <Button variant="ghost" size="icon" className="size-6" rounded="sm" onClick={() => setOpen(true)}>
            <Image src="/icons/identity.svg" alt="identity" width={24} height={24} />
          </Button>
        </div>
      </div>
      <SelectAddressModal
        open={open}
        value={selectedAddress?.id}
        token={token}
        addressTypes={[AddressType.OnChain]}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default OnChain
