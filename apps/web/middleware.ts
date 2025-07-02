import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, langCookieName, locales } from './i18n/config'
import { getLocale } from './lib/utils'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if there's any supported locale in the pathname
  const localeFromPathname = pathname.split('/')[1]
  const normalizedLocaleFromPathname = localeFromPathname?.toLowerCase()

  console.log('pathname', pathname)

  // Find the correct case-sensitive locale
  const currentLocale = locales.find((locale) => locale.toLowerCase() === normalizedLocaleFromPathname)

  if (!currentLocale) {
    const locale = getLocale(req)

    // e.g. incoming request is /user
    // The new URL is /en-US/user
    const newUrl = new URL(`/${locale}${pathname}`, req.url)
    newUrl.search = req.nextUrl.search

    const response = NextResponse.redirect(newUrl, 301)
    response.cookies.set(langCookieName, locale)

    return response
  } else if (currentLocale !== localeFromPathname && localeFromPathname) {
    const newUrl = new URL(`/${currentLocale}${pathname.substring(localeFromPathname.length + 1)}`, req.url)
    newUrl.search = req.nextUrl.search

    const response = NextResponse.redirect(newUrl, 301)
    response.cookies.set(langCookieName, localeFromPathname)

    return response
  }

  const response = NextResponse.next()
  response.cookies.set(langCookieName, localeFromPathname || defaultLocale)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)'],
}
