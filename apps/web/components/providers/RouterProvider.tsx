'use client'

import { useRouter, useParams } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { createContext } from 'react'
import { defaultLocale } from '@/i18n/config'
import { isAbsoluteUrl, openNewWindow } from '@/lib/utils'

export type RouterOptions = {
  query?: Record<string, string | number>
  params?: Record<string, string | number>
}

export type RouterFn = (url: string, options?: RouterOptions) => void

type Router = {
  push: RouterFn
  back: () => void
  replace: RouterFn
}

export const RouterContext = createContext<Router>({
  push: () => {},
  back: () => {},
  replace: () => {},
})

let routerInstance: Router | null = null

export const getRouter = () => {
  if (!routerInstance) {
    throw new Error('Router not initialized')
  }
  return routerInstance
}

export function createUrl(pathname: string, lang: string, options: RouterOptions = {}) {
  const { query, params } = options

  if (isAbsoluteUrl(pathname)) {
    const urlObj = new URL(pathname)
    for (const [key, value] of Object.entries(query || {})) {
      urlObj.searchParams.append(key, String(value))
    }
    return urlObj.toString()
  }

  let url = pathname
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`[${key}]`, String(value))
    }
  }

  if (query) {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      sp.append(key, String(value))
    }
    url = `${url}?${sp.toString()}`
  }

  return lang ? `/${lang}${url}` : url
}

export const RouterProvider = ({ children }: PropsWithChildren) => {
  const params = useParams()
  const router = useRouter()

  const lang: string = (params?.lang as string) || defaultLocale

  routerInstance = {
    push: (pathname, options) => {
      const url = createUrl(pathname, lang, options)
      if (isAbsoluteUrl(url)) {
        openNewWindow(url)
      } else {
        router.push(url)
      }
    },
    back: () => {
      router.back()
    },
    replace: (pathname, options) => {
      const url = createUrl(pathname, lang, options)
      if (isAbsoluteUrl(url)) {
        openNewWindow(url)
      } else {
        router.replace(url)
      }
    },
  }

  return <RouterContext.Provider value={routerInstance}>{children}</RouterContext.Provider>
}
