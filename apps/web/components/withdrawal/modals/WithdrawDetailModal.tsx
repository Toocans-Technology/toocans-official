'use client'

import dayjs from 'dayjs'
import { ArrowUpFromDot } from 'lucide-react'
import { FunctionComponent, useCallback } from 'react'
import { Button, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useRouter } from '@/hooks'
import { useT } from '@/i18n'
import { PATHNAMES } from '@/lib/utils'
import { getWithdrawInfo } from '@/services/wallet'
import { getStatus } from '../utils'

interface Props {
  id?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const WithdrawDetailModal: FunctionComponent<Props> = ({ id, open, onOpenChange }) => {
  const { t } = useT(['withdrawal', 'common'])
  const { data } = getWithdrawInfo(id)
  const router = useRouter()
  const status = getStatus(data?.status)

  const handleConfirm = useCallback(() => {
    onOpenChange?.(false)
    router.push(PATHNAMES.overview)
  }, [onOpenChange, router])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open)

      if (!open) {
        router.push(PATHNAMES.overview)
      }
    },
    [onOpenChange, router]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:withdrawModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2">
          <div className="flex flex-col items-center gap-4 py-8 text-sm">
            <div className="text-[#999]">{t('withdrawal:receivedAmount')}</div>
            <div className="flex items-center text-right font-medium">
              <span className="text-4xl">{data?.arriveQuantity}</span>
              <span className="ml-1">{data?.tokenName}</span>
            </div>
            <div className="flex items-center">
              <span className="bg-warning flex h-4 w-4 items-center justify-center rounded-full">
                <ArrowUpFromDot className="rotate-90 text-white" size="12" />
              </span>
              <span className="ml-1 text-[#222]">{t(`withdrawal:${status.text}`)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:network')}</div>
            <div className="text-right font-medium">{data?.chainName ?? '-'}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:address')}</div>
            <div className="overflow-hidden break-words text-right font-medium">{data?.address ?? '-'}</div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:withdrawAmount')}</div>
            <div className="text-right font-medium">
              {data?.totalQuantity} {data?.tokenName}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</div>
            <div className="text-right font-medium">
              {data?.platformFee} {data?.tokenName}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:time')}</div>
            <div className="text-right font-medium">{dayjs(Number(data?.createdAt)).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        </div>
        <DialogFooter>
          <Button rounded="full" onClick={handleConfirm}>
            {t('common:ok')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawDetailModal
