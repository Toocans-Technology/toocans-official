'use client'

import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Separator, toast } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useBatchDeleteWithdrawAddress } from '@/services/wallet'
import { HttpError } from '@/types/http'

interface Props {
  ids?: string[]
  onSuccess?: () => void
}

const BatchDeleteWithdrawAddressModal: FunctionComponent<Props> = ({ ids, onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteAddress, isPending } = useBatchDeleteWithdrawAddress()

  const handleSubmit = useCallback(async () => {
    if (!ids) {
      return
    }

    try {
      const res = await deleteAddress({ ids })

      if (!res) {
        return
      }

      onSuccess?.()
      toast.success(t('withdrawAddress:deleteWithdrawAddressSuccess'))
      setOpen?.(false)
    } catch (error) {
      toast.error((error as HttpError).message)
    }
  }, [ids, deleteAddress, onSuccess, t])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          rounded="full"
          variant="secondary"
          className="bg-foreground text-background hover:bg-foreground/80"
          onClick={() => setOpen(true)}
        >
          {t('common:delete')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {ids?.length && ids?.length > 1
              ? t('withdrawAddress:deleteWithdrawAddressBatch', { count: ids?.length })
              : t('withdrawAddress:deleteWithdrawAddress')}
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-6">
          <p className="text-sm text-[#666]">{t('withdrawAddress:deleteWithdrawAddressDescription')}</p>
        </div>
        <DialogFooter>
          <Button rounded="full" variant="secondary" onClick={() => setOpen(false)}>
            {t('common:cancel')}
          </Button>
          <Button
            rounded="full"
            disabled={isPending}
            onClick={handleSubmit}
            className="bg-foreground text-background hover:bg-foreground/80"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            {t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BatchDeleteWithdrawAddressModal
