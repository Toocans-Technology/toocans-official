import { useMemo } from 'react'
import { useT } from '@/i18n'
import { KycLevel } from '@/types/user'

export const useSecurityLevel = (kycLevel = KycLevel.unverified, hasGA = false) => {
  const { t } = useT('account')

  return useMemo(() => {
    switch (kycLevel) {
      case KycLevel.unverified:
        return hasGA ? t('account:high') : t('account:low')
      case KycLevel.low:
        return hasGA ? t('account:high') : t('account:low')
      default:
        return t('account:low')
    }
  }, [kycLevel, t, hasGA])
}
