// Locale 标准:
// BCP 47 https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers
// ISO 639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// ISO 3166-1 https://en.wikipedia.org/wiki/ISO_3166-1
import { isTranslateEnvironment } from '@/lib/utils/env'

export enum Locale {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
  EO = 'eo', // TODO: Used for Crowdin translate in context
}

export const defaultLocale = Locale.EN_US

export const locales = [Locale.EN_US, Locale.ZH_CN]

if (isTranslateEnvironment()) {
  locales.push(Locale.EO)
}

export const defaultNamespace = 'common'

export const langCookieName = 'lang'
