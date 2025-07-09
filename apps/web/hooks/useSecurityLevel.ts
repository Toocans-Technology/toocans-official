import { useMemo } from 'react'
import { useT } from '@/i18n'
import { KycLevel } from '@/types/user'

export const useSecurityLevel = (kycLevel = KycLevel.unverified) => {
  const { t } = useT('account')

  return useMemo(() => {
    switch (kycLevel) {
      case KycLevel.unverified:
        return t('account:low')
      case KycLevel.low:
        return t('account:medium')
      default:
        return t('account:low')
    }
  }, [kycLevel, t])
}
