'use client'

import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Separator, Tabs, TabsContent, TabsList, TabsTrigger, toast } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useAddWithdrawAddress } from '@/services/wallet'
import { HttpError } from '@/types/http'
import { ChargeType } from '@/types/withdraw'

interface Props {
  onSuccess?: () => void
}

const AddWithdrawAddressModal: FunctionComponent<Props> = ({ onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: addAddress, isPending } = useAddWithdrawAddress()

  const handleSubmit = useCallback(async () => {
    try {
      onSuccess?.()
      toast.success(t('withdrawAddress:addWithdrawAddressSuccess'))
      setOpen?.(false)
    } catch (error) {
      toast.error((error as HttpError).message)
    }
  }, [onSuccess, t])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button rounded="full" onClick={() => setOpen(true)}>
          {t('withdrawAddress:addWithdrawalAddress')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawAddress:addWithdrawAddress')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <Tabs defaultValue={ChargeType.OnChain.toString()} className="mt-2 w-full">
          <TabsList className="-mx-2 h-5 bg-transparent p-0">
            <TabsTrigger value={ChargeType.OnChain.toString()}>{t('withdrawal:onChain')}</TabsTrigger>
            <TabsTrigger value={ChargeType.Internal.toString()}>{t('withdrawal:internalTransfer')}</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value={ChargeType.OnChain.toString()} className="mt-2"></TabsContent>
          <TabsContent value={ChargeType.Internal.toString()} className="mt-2"></TabsContent>
        </Tabs>
        <DialogFooter>
          <Button rounded="full" disabled={isPending} onClick={handleSubmit}>
            {isPending && <Loader2Icon className="animate-spin" />}
            {t('common:save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddWithdrawAddressModal
