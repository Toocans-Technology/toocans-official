'use client'

import { FunctionComponent, useCallback } from 'react'
import { Button, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void | Promise<void>
}

const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title = 'Confirm',
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
}) => {
  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm?.()
    } finally {
      onOpenChange(false)
    }
  }, [onConfirm, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 py-6 sm:max-w-[432px]">
        <DialogHeader className="gap-0">
          <DialogTitle
            className="text-[16px] font-medium leading-6 text-[#222] [font-family:'Inter',Helvetica]"
            style={{ paddingBottom: '8px' }}
          >
            {title}
          </DialogTitle>
          <Separator />
        </DialogHeader>
        {description ? (
          <p className="text-[14px] font-normal leading-[22px] text-[#222] [font-family:'Inter',Helvetica]">
            {description}
          </p>
        ) : null}
        <DialogFooter>
          <Button
            variant="outline"
            rounded="full"
            onClick={() => onOpenChange(false)}
            className="h-10 text-[16px] font-medium leading-6 text-[#222]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex h-10 w-[96px] items-center justify-center gap-[10px] rounded-[40px] bg-[#222] text-[16px] font-medium leading-6 text-[#FDFDFD] hover:bg-[#222] hover:text-[#FDFDFD] focus:bg-[#222] active:bg-[#222]"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal
