'use client'

import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useUserInfo } from '@/services/user'
import BindStep from './BindStep'
import SendCodeStep from './SendCodeStep'

enum BindSteps {
  sendCode,
  bind,
}

const BindPhoneModal: FunctionComponent = () => {
  const { t } = useT(['account', 'common'])
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<BindSteps>(BindSteps.sendCode)
  const { data: userInfo, refetch } = useUserInfo()

  const handleSuccess = useCallback(() => {
    refetch()
    setOpen(false)
  }, [refetch])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" variant="secondary">
          {t('common:settings')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('account:bindPhoneNumber')}</DialogTitle>
          <Separator />
        </DialogHeader>
        {step === BindSteps.sendCode && <SendCodeStep userInfo={userInfo} onSuccess={() => setStep(BindSteps.bind)} />}
        {step === BindSteps.bind && (
          <BindStep userInfo={userInfo} onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BindPhoneModal
