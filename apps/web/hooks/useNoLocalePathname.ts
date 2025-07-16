import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const useNoLocalePathname = () => {
  const pathname = usePathname()

  // use regex remove lang prefix from pathname
  // e.g. 'zh-TW', 'en-US', 'zh', 'en', ... etc -> ''
  const pathnameNoLocale = useMemo(() => {
    return pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')
  }, [pathname])

  return pathnameNoLocale || '/'
}
