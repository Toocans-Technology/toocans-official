'use client'

import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Label, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useUserVerifyInfo } from '@/services/user'
import { KycLevel } from '@/types/user'

const VerifyModal: FunctionComponent = () => {
  const { t } = useT(['common'])
  const [open, setOpen] = useState(false)
  const { data: verifyInfo } = useUserVerifyInfo()

  console.log('verifyInfo', verifyInfo)

  useEffect(() => {
    const opened = verifyInfo?.kycLevel === KycLevel.unverified || !verifyInfo
    setOpen(opened)
  }, [verifyInfo])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button rounded="full" onClick={() => setOpen(false)}>
            {t('common:verifyModal.verify')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyModal
