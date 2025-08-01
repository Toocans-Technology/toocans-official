import { WithdrawalStatus } from '@/types/withdraw'

export const getStatus = (status = WithdrawalStatus.PendingReview) => {
  switch (status) {
    case WithdrawalStatus.ManuallyRejected:
    case WithdrawalStatus.Failed:
    case WithdrawalStatus.ManualRejectFailed:
      return { text: 'failed', color: 'bg-destructive/40 text-destructive' }
    case WithdrawalStatus.Success:
      return { text: 'sent', color: 'bg-brand/40 text-brand' }
    default:
      return { text: 'transferring', color: 'bg-warning/40 text-[#736800]' }
  }
}
