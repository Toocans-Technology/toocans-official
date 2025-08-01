import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { type NextRequest } from 'next/server'
import { defaultLocale, type Locale, locales, langCookieName } from '@/i18n/config'

export function getLocale(req: NextRequest): string {
  const localeFromCookie = req.cookies.get(langCookieName)?.value

  if (localeFromCookie && locales.includes(localeFromCookie as Locale)) {
    return localeFromCookie
  }

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  try {
    return matchLocale(languages, locales, defaultLocale)
  } catch (_) {
    return defaultLocale
  }
}
