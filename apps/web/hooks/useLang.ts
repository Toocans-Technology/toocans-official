import { useParams } from 'next/navigation'
import { Locale } from '@/i18n/config'

export const useLang = (): Locale => {
  const params = useParams<{ lang: Locale }>()
  return params.lang || Locale.EN_US
}
