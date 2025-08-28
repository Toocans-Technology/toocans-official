'use client'

import { FunctionComponent, useCallback } from 'react'
import { Button, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useWithdrawAddressList } from '@/services/wallet/withdrawAddressList'
import EmptyAddress from './EmptyAddress'

interface Props {
  tokenName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SelectAddressModal: FunctionComponent<Props> = ({ tokenName, open, onOpenChange }) => {
  const { t } = useT(['withdrawal', 'common'])
  const { data: addressList } = useWithdrawAddressList()

  console.log('addressList', addressList)

  const handleConfirm = useCallback(() => {
    // onOpenChange?.(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:selectAddressModal.title', { tokenName: tokenName })}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2">
          <EmptyAddress />
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
