import { defaultLocale, locales, defaultNamespace } from './config'
import type { Namespace } from './types'

export const getOptions = (lng: string = defaultLocale, ns: Namespace = defaultNamespace) => ({
  // debug: true,
  supportedLngs: locales,
  fallbackLng: defaultLocale,
  lng,
  fallbackNS: defaultNamespace,
  defaultNS: defaultNamespace,
  ns,
  interpolation: {
    format: (value: string, format?: string) => {
      if (format === 'capitalize') {
        if (!value) return ''
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    },
  },
})
