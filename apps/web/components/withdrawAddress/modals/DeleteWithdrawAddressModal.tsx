'use client'

import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useState } from 'react'
import { Button, Separator, toast, Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { useBatchDeleteWithdrawAddress } from '@/services/wallet'
import { WithdrawAddress } from '@/services/wallet/schemas/address.schema'
import { HttpError } from '@/types/http'

interface Props {
  data?: WithdrawAddress
  onSuccess?: () => void
}

const DeleteWithdrawAddressModal: FunctionComponent<Props> = ({ data, onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteAddress, isPending } = useBatchDeleteWithdrawAddress()

  const handleSubmit = useCallback(async () => {
    if (!data) {
      return
    }

    try {
      const res = await deleteAddress({ ids: [data.id] })

      if (!res) {
        return
      }

      onSuccess?.()
      toast.success(t('withdrawAddress:deleteWithdrawAddressSuccess'))
      setOpen?.(false)
    } catch (error) {
      toast.error((error as HttpError).message)
    }
  }, [data, deleteAddress, onSuccess, t])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
              <Image src="/icons/delete.svg" alt="delete" width={20} height={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('common:delete')}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawAddress:deleteWithdrawAddress')}</DialogTitle>
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

export default DeleteWithdrawAddressModal
