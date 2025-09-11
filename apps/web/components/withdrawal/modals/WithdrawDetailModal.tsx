'use client'

import dayjs from 'dayjs'
import { ArrowUpFromDot } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useMemo } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Button, Separator, toast } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components'
import { useRouter } from '@/hooks'
import { useT } from '@/i18n'
import { PATHNAMES } from '@/lib/utils'
import { getWithdrawInfo } from '@/services/wallet'
import { InternalTransferType, WithdrawMethod } from '@/types/withdraw'
import { getWithdrawalStatus } from '../utils'

interface Props {
  id?: string
  open?: boolean
  isDetail?: boolean
  onOpenChange?: (open: boolean) => void
}

const WithdrawDetailModal: FunctionComponent<Props> = ({ id, open, isDetail, onOpenChange }) => {
  const { t } = useT(['withdrawal', 'common'])
  const { data } = getWithdrawInfo(id)
  const router = useRouter()
  const status = getWithdrawalStatus(data?.status)
  const isOnChain = data?.withdrawMethod === WithdrawMethod.OnChain

  const addressTag = useMemo(() => {
    switch (data?.addressTag) {
      case InternalTransferType.Email.toString():
        return t('withdrawal:email')

      case InternalTransferType.Phone.toString():
        return t('withdrawal:phone')

      case InternalTransferType.UID.toString():
        return t('withdrawal:uid')
      default:
        return t('withdrawal:email')
    }
  }, [data, t])

  const handleConfirm = useCallback(() => {
    onOpenChange?.(false)
    if (!isDetail) {
      router.push(PATHNAMES.overview)
    }
  }, [isDetail, onOpenChange, router])

  const handleCopy = useCallback(() => {
    toast.success(t('common:copySuccess'))
  }, [t])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open)

      if (!open && !isDetail) {
        router.push(PATHNAMES.overview)
      }
    },
    [isDetail, onOpenChange, router]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('withdrawal:withdrawModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="grid gap-2">
          {status.text === 'sent' ? (
            <div className="flex flex-col items-center gap-4 text-sm">
              <div className="flex items-center">
                <Image src="/icons/check-mark.svg" alt="check-mark" width={159} height={107} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="text-[#999]">{t('withdrawal:receivedAmount')}</div>
                <div className="flex items-baseline justify-center font-medium">
                  <span className="text-2xl">{data?.arriveQuantity}</span>
                  <span className="ml-1 text-[#666]">{data?.tokenName}</span>
                  <span className="ml-1 text-xs text-[#666]">{t('withdrawal:sent')}</span>
                </div>
              </div>
            </div>
          ) : (
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
          )}
          {isOnChain ? (
            <>
              <div className="grid grid-cols-2 items-center py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:network')}</div>
                <div className="text-right">
                  {data?.protocolName ? `${data?.chainName}(${data?.protocolName})` : (data?.chainName ?? '-')}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:address')}</div>
                <div className="col-span-2 flex items-center justify-end">
                  <div className="overflow-hidden break-words text-right">{data?.address ?? '-'}</div>
                  <CopyToClipboard text={data?.address || ''} onCopy={handleCopy}>
                    <Button variant="ghost" size="icon" className="size-5" rounded="sm">
                      <Image src="/icons/copy.svg" alt="copy" width={16} height={16} />
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>
              {data?.txId && (
                <div className="grid grid-cols-3 items-center py-1.5 text-sm">
                  <div className="text-[#999]">{t('withdrawal:hash')}</div>
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="overflow-hidden break-words text-right">{data?.txId}</div>
                    <CopyToClipboard text={data?.txId || ''} onCopy={handleCopy}>
                      <Button variant="ghost" size="icon" className="size-5" rounded="sm">
                        <Image src="/icons/copy.svg" alt="copy" width={16} height={16} />
                      </Button>
                    </CopyToClipboard>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 items-center py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:withdrawAmount')}</div>
                <div className="text-right">
                  {data?.totalQuantity} {data?.tokenName}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 items-center py-1.5 text-sm">
                <div className="text-[#999]">{addressTag}</div>
                <div className="text-right">{data?.transferShowName ?? '-'}</div>
              </div>
              <div className="grid grid-cols-2 items-center py-1.5 text-sm">
                <div className="text-[#999]">{t('withdrawal:nickname')}</div>
                <div className="overflow-hidden break-words text-right">{data?.transferUserNickName ?? '-'}</div>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:chargeAndNetwork')}</div>
            <div className="text-right font-medium">
              {isOnChain ? `${data?.platformFee} ${data?.tokenName}` : t('withdrawal:free')}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center py-1.5 text-sm">
            <div className="text-[#999]">{t('withdrawal:time')}</div>
            <div className="text-right">
              {dayjs(
                Number(getWithdrawalStatus(data?.status).text === 'sent' ? data?.arriveTime : data?.createdAt)
              ).format('YYYY-MM-DD HH:mm:ss')}
            </div>
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
