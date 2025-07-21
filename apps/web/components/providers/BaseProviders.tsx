'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'
import i18next from '@/i18n'
import { initCscFetcher } from '@/lib/api'
import { UrlQueryObject } from '@/lib/api/types'
import { isTestingEnvironment, trimmedSearchParams, typedStorage } from '@/lib/utils'
import { getQueryClient } from '@/lib/utils/queryClient'

initCscFetcher({
  base: {
    injectHeader: async (options) => {
      const token = typedStorage.accessToken
      const lang = i18next.language

      return {
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang,
      }
    },
    searchStringGenerator: (options) => {
      const { query } = options as { query?: UrlQueryObject }
      return query ? trimmedSearchParams(query).toString() : ''
    },
  },
  csc: {
    exposeError: isTestingEnvironment(),
  },
})

export function BaseProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange enableColorScheme>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  )
}
