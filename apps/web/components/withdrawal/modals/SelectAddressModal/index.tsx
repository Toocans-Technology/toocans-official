'use client'

import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Separator,
} from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useRouter } from '@/hooks'
import { useT } from '@/i18n'
import { PATHNAMES } from '@/lib/utils'
import { Token } from '@/services/basicConfig'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { useWithdrawAddressList } from '@/services/wallet/withdrawAddressList'
import { AddressType } from '@/types/withdraw'
import EmptyAddress from './EmptyAddress'
import ListItem from './ListItem'

interface Props {
  value?: string
  open?: boolean
  token?: Token
  addressTypes?: AddressType[]
  onOpenChange?: (open: boolean) => void
  onConfirm?: (address?: WithdrawAddress) => void
}

const SelectAddressModal: FunctionComponent<Props> = ({
  value,
  token,
  open,
  addressTypes,
  onConfirm,
  onOpenChange,
}) => {
  const { t } = useT(['withdrawal', 'common'])
  const router = useRouter()
  const isOnChain = addressTypes?.includes(AddressType.OnChain)
  const { data: addressList } = useWithdrawAddressList({
    tokenId: isOnChain ? token?.tokenId : undefined,
    addressTypes: addressTypes?.join(','),
  })
  const [selectedAddressId, setSelectedAddressId] = useState<string>()

  useEffect(() => {
    setSelectedAddressId(value)
  }, [value])

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedAddressId === id) {
        setSelectedAddressId(undefined)
        onConfirm?.(undefined)
      } else {
        const address = addressList?.find((item) => item.id === id)
        setSelectedAddressId(id)
        onConfirm?.(address)
      }

      onOpenChange?.(false)
    },
    [addressList, onConfirm, onOpenChange, selectedAddressId]
  )

  const handleAddNow = useCallback(() => {
    onOpenChange?.(false)
    router.push(PATHNAMES.withdrawAddress)
  }, [onOpenChange, router])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:selectAddressModal.title', { tokenName: token?.tokenName })}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2">
          <Command
            filter={(value, search, keywords) => {
              if (keywords?.some((keyword) => keyword.toLowerCase().includes(search.toLowerCase()))) return 1
              return 0
            }}
          >
            <CommandInput
              className="h-8"
              inputWrapperClassName="h-8"
              placeholder={t('withdrawal:selectAddressModal.searchPlaceholder')}
            />
            <CommandList className="mt-4">
              <CommandEmpty>
                <EmptyAddress />
              </CommandEmpty>
              {addressList?.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.addressName ?? '', item.address ?? '']}
                  className="mb-4 bg-transparent p-0 data-[selected=true]:bg-transparent"
                >
                  <ListItem
                    key={item.id}
                    data={item}
                    onSelect={handleSelect}
                    isSelected={selectedAddressId === item.id}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
        <DialogFooter>
          <Button rounded="full" onClick={handleAddNow}>
            {t('withdrawal:selectAddressModal.addNow')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectAddressModal
