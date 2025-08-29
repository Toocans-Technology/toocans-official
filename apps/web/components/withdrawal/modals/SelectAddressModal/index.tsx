'use client'

import { FunctionComponent, useCallback, useState } from 'react'
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
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { useWithdrawAddressList } from '@/services/wallet/withdrawAddressList'
import EmptyAddress from './EmptyAddress'
import ListItem from './ListItem'

interface Props {
  open?: boolean
  tokenName?: string
  onOpenChange?: (open: boolean) => void
  onConfirm?: (address: WithdrawAddress) => void
}

const SelectAddressModal: FunctionComponent<Props> = ({ tokenName, open, onConfirm, onOpenChange }) => {
  const { t } = useT(['withdrawal', 'common'])
  const router = useRouter()
  const { data: addressList } = useWithdrawAddressList()
  const [selectedAddress, setSelectedAddress] = useState<string[]>([])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedAddress((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [id]
      })

      const address = addressList?.find((item) => item.id === id)

      if (address) {
        onConfirm?.(address)
      }

      onOpenChange?.(false)
    },
    [addressList, onConfirm, onOpenChange]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setSelectedAddress([])
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleConfirm = useCallback(() => {
    onOpenChange?.(false)
    router.push(PATHNAMES.withdrawAddress)
  }, [onOpenChange, router])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:selectAddressModal.title', { tokenName: tokenName })}</DialogTitle>
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
                    isSelected={selectedAddress.includes(item.id)}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
        <DialogFooter>
          <Button rounded="full" onClick={handleConfirm}>
            {t('withdrawal:selectAddressModal.addNow')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectAddressModal
