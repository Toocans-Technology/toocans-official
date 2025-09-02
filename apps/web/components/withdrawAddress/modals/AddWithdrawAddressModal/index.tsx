'use client'

import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { AddressType, ChargeType } from '@/types/withdraw'
import InternalTransfer from './InternalTransfer'
import OnChain from './OnChain'

interface Props {
  chargeType?: string
  onSuccess?: (addressType: AddressType) => void
}

const AddWithdrawAddressModal: FunctionComponent<Props> = ({ chargeType, onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [open, setOpen] = useState(false)
  const [chargeTypeState, setChargeTypeState] = useState<string>(chargeType ?? ChargeType.OnChain.toString())

  const handleSuccess = useCallback(
    (addressType: AddressType) => {
      onSuccess?.(addressType)
      setOpen(false)
    },
    [onSuccess]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" onClick={() => setOpen(true)}>
          {t('withdrawAddress:addWithdrawalAddress')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('withdrawAddress:addWithdrawAddress')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Tabs className="mt-2 w-full" value={chargeTypeState} onValueChange={setChargeTypeState}>
          <TabsList className="-mx-2 h-5 bg-transparent p-0">
            <TabsTrigger value={ChargeType.OnChain.toString()}>{t('withdrawal:onChain')}</TabsTrigger>
            <TabsTrigger value={ChargeType.Internal.toString()}>{t('withdrawal:internalTransfer')}</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value={ChargeType.OnChain.toString()} className="mt-2">
            <OnChain onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value={ChargeType.Internal.toString()} className="mt-2">
            <InternalTransfer onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddWithdrawAddressModal
