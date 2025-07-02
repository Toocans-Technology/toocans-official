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
})
