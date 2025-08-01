'use client'

import { FunctionComponent } from 'react'
import { Button, Label, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useT } from '@/i18n'

interface Props {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const VerifyModal: FunctionComponent<Props> = ({ open, onOpenChange }) => {
  const { t } = useT(['common'])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('common:verifyModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-6 text-sm">
          <p className="text-[#666]">{t('common:verifyModal.description')}</p>
          <div>
            <Label>{t('common:verifyModal.requirements')} </Label>
            <ul className="mt-2 flex flex-col gap-4">
              <li className="rounded-md bg-[#E1DFDF] px-2.5 py-3 text-[#222]">{t('common:verifyModal.documents')}</li>
              <li className="rounded-md bg-[#E1DFDF] px-2.5 py-3 text-[#222]">
                {t('common:verifyModal.personalInformation')}
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button rounded="full" onClick={() => onOpenChange?.(false)}>
            {t('common:verifyModal.verify')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyModal
