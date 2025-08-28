'use client'

import { FunctionComponent, useCallback } from 'react'
import { Button, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useT } from '@/i18n'

interface Props {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const AddAddressModal: FunctionComponent<Props> = ({ open, onOpenChange }) => {
  const { t } = useT(['withdrawal', 'common'])

  const handleConfirm = useCallback(() => {
    // onOpenChange?.(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:addAddressModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2"></div>
        <DialogFooter>
          <Button rounded="full" onClick={handleConfirm}>
            {t('common:save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAddressModal
